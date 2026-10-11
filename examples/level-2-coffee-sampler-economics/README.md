# L2-03 — Compare coffee sampler fulfilment routes

[All examples](../README.md) · [Exercise brief](brief.md)

Expose the cash gap hidden by a positive per-order margin.

**Status: designed, not executed.** Expected outputs below are acceptance requirements, not recorded results.

## Start

Use the [shared run instructions](../RUNNING.md) in a disposable ozeylab checkout. The brief is supplied input; it is not evidence of demand.

```bash
node scripts/cli.ts create example-l2-03 --spec examples/level-2-coffee-sampler-economics/brief.md
```

## Exact prompt

```text
Read examples/RUNNING.md and examples/level-2-coffee-sampler-economics/brief.md. Follow their evidence, review and execution rules.

Use case-study-create for example-l2-03. Compare the three goods fulfilment routes on the same dates, currency and horizons. Screen other families, including an information-only alternative where relevant. Build a dated cash model that exposes supplier payment, customer receipt and refund timing. Include landed unit cost, stock loss, payment fees, packaging, shipping and owner work. Calculate the pre-financing peak funding gap separately from the reserve. Test a combined downside of slower orders, delayed fulfilment and returns. Show what remains unknown rather than inventing supplier terms.

Report actual output paths, checks performed, unresolved evidence and the next decision. Distinguish a producer self-check from independent review.
```

## Expected outputs

Paths below are relative to `projects/example-l2-03/`.

- case-study.md: route comparison and launch dependencies
- finance/: cash schedules, stock assumptions and downside results
- wiki/: supplier, fulfilment and product-requirement evidence

## Check the result

- A positive contribution per order does not conceal a cash gap.
- Customer deposits and refund liabilities are visible in the schedule.
- Stock, orders and capacity reconcile; unsold stock is not booked as sales.

Apply the shared verification rules as well. A structural pass does not establish demand, correct judgement or a successful launch.

## Next decision

Obtain the supplier and fulfilment evidence that controls the funding decision.
