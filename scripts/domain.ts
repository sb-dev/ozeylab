import { domainToASCII } from 'node:url';
export function normaliseDomain(value: string) {
  const ascii = domainToASCII(value.trim().toLowerCase());
  if (ascii.length > 253 || !ascii.includes('.') || !ascii.split('.').every(x => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(x))) throw new Error('Supply an exact domain, without a URL or path.');
  return ascii;
}
export function interpret(display: string, payload: any, checkedAt: string) {
  const ascii = normaliseDomain(display);
  const matches = Array.isArray(payload?.results) ? payload.results.filter((x: any) => x.domainName?.toLowerCase() === ascii) : [];
  const r = matches.length === 1 ? matches[0] : null;
  const available = r?.purchasable === true && r?.purchaseType === 'registration';
  const resale = r?.purchasable === true && r?.purchaseType && r.purchaseType !== 'registration';
  return { display, ascii, provider: 'name.com', checkedAt, status: available ? 'available' : r && r.purchasable !== true ? 'unavailable' : 'unknown', reason: !r ? 'Missing or conflicting exact result' : available ? 'Explicit registration offer' : resale ? 'Non-registration purchase offer; registration status not established' : 'Provider does not offer registration; registration itself is not proved', premium: typeof r?.premium === 'boolean' ? r.premium : null, initialCost: typeof r?.purchasePrice === 'number' ? r.purchasePrice : null, renewalCost: typeof r?.renewalPrice === 'number' ? r.renewalPrice : null, currency: 'USD', initialTerm: 'provider minimum term; verify for this TLD', renewalTerm: 'annual', fees: 'not separately verified', restrictions: 'check TLD requirements before registration', resale: resale ? { purchaseType: r.purchaseType, askingPrice: r.purchasePrice ?? null } : null, ownership: 'unknown' };
}
export async function checkDomain(display: string, env = process.env, fetcher = fetch) {
  const ascii = normaliseDomain(display), checkedAt = new Date().toISOString();
  const unknown = (reason: string) => ({ result: { ...interpret(display, {}, checkedAt), reason }, response: null });
  if (!env.NAMECOM_USERNAME || !env.NAMECOM_TOKEN) return unknown('Provider credentials missing');
  try {
    const response = await fetcher('https://api.name.com/core/v1/domains:checkAvailability', { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000), headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(`${env.NAMECOM_USERNAME}:${env.NAMECOM_TOKEN}`).toString('base64') }, body: JSON.stringify({ domainNames: [ascii] }) });
    if (!response.ok) return unknown(`Provider HTTP ${response.status}`);
    const body = await response.json();
    return { result: interpret(display, body, checkedAt), response: body };
  } catch { return unknown('Provider request failed or timed out'); }
}
