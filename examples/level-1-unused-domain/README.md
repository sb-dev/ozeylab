# L1-02 — Explore an unused domain

[All examples](../README.md) · [Exercise brief](brief.md)

Work from a domain without inventing its value or ownership.

**Status: designed, not executed.** Expected outputs below are acceptance requirements, not recorded results.

## Start

Use the [shared run instructions](../RUNNING.md) in a disposable ozeylab checkout. The brief is supplied input; it is not evidence of demand.

```bash
node scripts/cli.ts create example-l1-02 --domain brewbench.example --spec examples/level-1-unused-domain/brief.md
```

## Exact prompt

```text
Read examples/RUNNING.md and examples/level-1-unused-domain/brief.md. Follow their evidence, review and execution rules.

Use case-study-create for example-l1-02. Read the domain-only business input in the brief. Keep ownership, availability, traffic and sale value unknown. Screen all six families. Show the domain-sale baseline only conditionally on verified ownership and transferable rights; otherwise use no new commitment. Distinguish selling the domain from selling a developed asset and from retaining an operation. Define the evidence needed to compare them. Do not invent a buyer, a valuation or a registration result. Keep the recommendation conditional where the missing asset evidence controls the choice.

Report actual output paths, checks performed, unresolved evidence and the next decision. Distinguish a producer self-check from independent review.
```

## Expected outputs

Paths below are relative to `projects/example-l1-02/`.

- project.md: exact supplied domain with unverified ownership
- case-study.md: conditional asset baseline and evidence gaps
- naming.md: domain status, limits and checks needed for a real domain

## Check the result

- The exercise address is not reported as available, owned or valuable.
- An asking price is not treated as a completed sale.
- Holding and no-sale costs remain visible if an asset-sale model is used.

Apply the shared verification rules as well. A structural pass does not establish demand, correct judgement or a successful launch.

## Next decision

For a real case, supply the exact domain and ownership evidence before relying on an asset-sale baseline.
