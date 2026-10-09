// Cash events have explicit ordering within each day. No financing is revenue.
const kinds = ['receipt', 'cost', 'owner-pay', 'sale', 'cash-transferred', 'financing'];
const numeric = (n: unknown) => typeof n === 'number' && Number.isFinite(n) && n >= 0;
export function calculate(model: any) {
  if (!/^[A-Z]{3}$/.test(model.currency) || !model.assessment || !model.option) throw new Error('Finance requires currency, assessment and option.');
  if (typeof model.decisionDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(model.decisionDate) || Number.isNaN(Date.parse(model.decisionDate)) || new Date(model.decisionDate).toISOString().slice(0, 10) !== model.decisionDate) throw new Error('Finance requires a valid decisionDate.');
  if (!['wholly-owned', 'owner-ledger'].includes(model.ownership)) throw new Error('Specify ownership treatment.');
  if (!Array.isArray(model.scenarios) || !model.scenarios.length) throw new Error('Add scenarios.');
  const ids = new Set();
  for (const s of model.scenarios) {
    if (!s.id || ids.has(s.id)) throw new Error('Scenario IDs must be unique.');
    ids.add(s.id);
    if (!Array.isArray(s.events)) throw new Error('Scenario needs cash events.');
    const orders = new Set();
    for (const e of s.events) {
      if (!Number.isInteger(e.day) || e.day < 0 || !Number.isInteger(e.order) || e.order < 0 || !kinds.includes(e.kind) || !(e.amount === null || numeric(e.amount)) || !e.basis) throw new Error('Invalid cash event or missing basis.');
      const key = `${e.day}:${e.order}`;
      if (orders.has(key)) throw new Error('Cash event ordering must be unique.');
      orders.add(key);
    }
    for (const h of s.hours ?? []) if (!Number.isInteger(h.day) || h.day < 0 || !(h.hours === null || numeric(h.hours)) || !h.basis) throw new Error('Invalid owner hours.');
  }
  const horizons = model.horizons ?? [90, 365, 1095];
  if (!Array.isArray(horizons) || !horizons.length || horizons.some((h: any) => !Number.isInteger(h) || h < 1)) throw new Error('Invalid horizons.');
  if (!(model.hourlyValue === null || numeric(model.hourlyValue))) throw new Error('Invalid hourly value.');
  return { option: model.option, assessment: model.assessment, currency: model.currency, results: model.scenarios.flatMap((s: any) => horizons.map((horizon: number) => {
    const events = s.events.filter((e: any) => e.day <= horizon).sort((a: any, b: any) => a.day - b.day || a.order - b.order);
    const business = events.filter((e: any) => e.kind !== 'financing');
    const known = business.every((e: any) => e.amount !== null);
    let bank = 0, beforePay = 0, lowest = 0, deficit = false, payback: number | null = null;
    for (const e of business) {
      if (e.amount === null) continue;
      const sign = ['receipt', 'sale'].includes(e.kind) ? 1 : -1;
      bank += sign * e.amount;
      if (e.kind !== 'owner-pay') beforePay += sign * e.amount;
      lowest = Math.min(lowest, bank);
      if (bank < 0) { deficit = true; payback = null; }
      else if (deficit && payback === null) payback = e.day;
    }
    const hourEvents = (s.hours ?? []).filter((x: any) => x.day <= horizon);
    const hours = hourEvents.some((x: any) => x.hours === null) ? null : hourEvents.reduce((n: number, x: any) => n + x.hours, 0);
    let attributable = known ? beforePay : null;
    if (model.ownership === 'owner-ledger') {
      if (!Array.isArray(s.ownerLedger)) throw new Error('Partner/debt cases require an owner ledger.');
      for (const e of s.ownerLedger) if (!Number.isInteger(e.day) || e.day < 0 || !['in', 'out'].includes(e.direction) || !(e.amount === null || numeric(e.amount)) || !e.basis) throw new Error('Invalid owner ledger.');
      const ledger = s.ownerLedger.filter((x: any) => x.day <= horizon);
      attributable = ledger.some((x: any) => x.amount === null) ? null : ledger.reduce((n: number, x: any) => n + (x.direction === 'in' ? x.amount : -x.amount), 0);
    }
    return { scenario: s.id, horizonDays: horizon, cashAfterCosts: known ? bank : null, cashBeforeOwnerPay: known ? beforePay : null, peakFunding: known ? Math.max(0, -lowest) : null, firstCashDay: known ? business.find((e: any) => ['receipt', 'sale'].includes(e.kind) && e.amount > 0)?.day ?? null : null, paybackDay: known ? payback : null, ownerHours: hours, ownerResult: attributable !== null && hours !== null && model.hourlyValue !== null ? attributable - hours * model.hourlyValue : null, conditional: s.conditional ?? false };
  })) };
}
