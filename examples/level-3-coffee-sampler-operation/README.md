# L3-04 — Bootstrap a coffee sampler operation

[All examples](../README.md) · [Exercise brief](brief.md)

Reconcile an order, stock, costs and a return.

**Status: designed, not executed.** Expected outputs below are acceptance requirements, not recorded results.

## Start

Use the [shared run instructions](../RUNNING.md) in a disposable ozeylab checkout. The brief is supplied input; it is not evidence of demand. For this Level 3 exercise, first complete the [accepted-selection preparation](../RUNNING.md#level-3-accepted-selection). The proposed route in the brief is not itself an accepted project record.

```bash
node scripts/cli.ts create example-l3-04 --spec examples/level-3-coffee-sampler-operation/brief.md
```
Bootstrap profile: `goods`.


## Exact prompt

```text
Read examples/RUNNING.md and examples/level-3-coffee-sampler-operation/brief.md. Follow their evidence, review and execution rules.

Use project-bootstrap for example-l3-04 after the accepted-selection preparation below. Use the goods profile. Produce the starting records from the brief. Reconcile the sample order from stock allocation through packing, shipping cost, cash receipt and return. Keep damaged or returned units separate from saleable stock until inspected. Show unknown supplier, packaging and product-requirement evidence explicitly. Include delayed supply and refund exceptions. Complete the repository exercise without claiming a physical product or fulfilment process has been approved. Apply the shared GitHub handover rule before claiming completion.

Report actual output paths, checks performed, unresolved evidence and the next decision. Distinguish a producer self-check from independent review.
```

## Expected outputs

Paths below are relative to the target repository unless a central record is named.

- operations/fulfilment.md and product/supplier requirements
- Sample catalogue, unit-cost inputs, stock ledger, orders and return record
- Commercial launch specification with unresolved supplier and product checks

## Check the result

- Two sampler orders allocate six individual items, with no negative or double-counted stock.
- The returned sampler’s three items have an explicit disposition.
- Refunds and shipping costs reconcile with the sample cash record.

Apply the shared verification rules as well. A structural pass does not establish demand, correct judgement or a successful launch.

## Next decision

Resolve supplier and product requirements before purchasing stock or accepting orders.
