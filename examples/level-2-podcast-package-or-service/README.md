# L2-01 — Sell a podcast package or run a service

[All examples](../README.md) · [Exercise brief](brief.md)

Compare asset sale, no sale and retained delivery on the same basis.

**Status: designed, not executed.** Expected outputs below are acceptance requirements, not recorded results.

## Start

Use the [shared run instructions](../RUNNING.md) in a disposable ozeylab checkout. The brief is supplied input; it is not evidence of demand.

```bash
node scripts/cli.ts create example-l2-01 --spec examples/level-2-podcast-package-or-service/brief.md
```

## Exact prompt

```text
Read examples/RUNNING.md and examples/level-2-podcast-package-or-service/brief.md. Follow their evidence, review and execution rules.

Use case-study-create for example-l2-01. Inspect examples/service-case/case-study.md and its finance models as synthetic inputs. Register them with their provenance. Reproduce the results before extending the comparison. Explain why the preferred route can change with the horizon and owner-hour value. Keep a no-sale outcome beside the conditional package sale. Describe transferable assets and support obligations for the asset route; describe intake, revisions and delivery capacity for the service. Identify which assumptions need real buyer evidence. Give a conditional recommendation, not a selected route or a forecast of likely returns.

Report actual output paths, checks performed, unresolved evidence and the next decision. Distinguish a producer self-check from independent review.
```

## Expected outputs

Paths below are relative to `projects/example-l2-01/`.

- finance/: reproduced and clearly labelled scenario calculations
- case-study.md: comparable cash, owner time, funding and decision thresholds
- bootstrap.md: assets-profile and services-profile starting scopes

## Check the result

- The 1,095-day fixture cash totals are £1,800, £9,140, −£1,960 and £70,800 for domain, package, no sale and service respectively.
- Owner time is charged once; unsold asset value is not counted as cash.
- A package transfer includes editable assets, rights and transfer checks; a service requires a sample delivery.

Apply the shared verification rules as well. A structural pass does not establish demand, correct judgement or a successful launch.

## Next decision

Replace the decisive synthetic assumptions with inspected evidence before making a real selection.
