# Financial modelling

Use the calculation rules in docs/specs/case-study-workflow.md section 7.
The CLI calculates dated cash events; the agent must build and justify the drivers.

Save one <option>.model.json per option in finance/. Use templates/finance.model.json.
Amounts are nonnegative. Use null for unknowns. Every event and hours item has a basis.
Event day is relative to decisionDate. order fixes within-day cash timing.

Kinds: receipt, cost, owner-pay, sale, cash-transferred, financing.
Revenue recognition differs from cash: record earned revenue and unpaid orders in
the case study, not as received cash. Financing is excluded from operating cash and
the pre-financing funding gap. Cash-transferred removes cash included in a sale.
Do not record the sold business's subsequent income as the seller's cash.

For wholly-owned projects, ownerResult uses cash before owner pay minus total
owner hours times hourlyValue. Actual owner pay remains in the bank cash schedule.
For partners, debt or outside equity, use ownership: owner-ledger and a scenario
ownerLedger of {day, direction: in|out, amount, basis}. Record contributions, direct
costs, salary, distributions and sale receipts once. Company cash is separate.

Use downside, central and upside scenarios, plus no-sale when relevant. Use day 90,
365 and 1095 unless a justified comparison needs different horizons. Null cash
propagates to cash, funding and payback. Null hours or hourlyValue keeps the owner
result unknown. No inferred sale probabilities or retained business value are added.

Run `node scripts/cli.ts finance PROJECT-ID`. Review driver capacity, tax treatment,
acquisition denominators, debt obligations, double counting and decision thresholds.
Arithmetic checks cannot validate demand, valuations or assumptions.
