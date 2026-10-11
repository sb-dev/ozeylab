# L3-01 — Bootstrap an invoice reconciliation tool

[All examples](../README.md) · [Exercise brief](brief.md)

Build and check one local CSV-to-report workflow.

**Status: designed, not executed.** Expected outputs below are acceptance requirements, not recorded results.

## Start

Use the [shared run instructions](../RUNNING.md) in a disposable ozeylab checkout. The brief is supplied input; it is not evidence of demand. For this Level 3 exercise, first complete the [accepted-selection preparation](../RUNNING.md#level-3-accepted-selection). The proposed route in the brief is not itself an accepted project record.

```bash
node scripts/cli.ts create example-l3-01 --spec examples/level-3-reconciliation-tool/brief.md
```
Bootstrap profile: `software`.


## Exact prompt

```text
Read examples/RUNNING.md and examples/level-3-reconciliation-tool/brief.md. Follow their evidence, review and execution rules.

Use project-bootstrap for example-l3-01 after the accepted-selection preparation below. Use the software profile. Implement the specified local reconciliation path and its input contract. Include small synthetic CSV fixtures for full payment, no payment, underpayment, overpayment, duplicate IDs and currency mismatch. Run documented setup from a clean workspace and verify the exported report against the fixtures. Preserve the accepted central case as a historical reference. Record actual checks and a next work unit. Apply the shared GitHub handover rule before claiming bootstrap completion.

Report actual output paths, checks performed, unresolved evidence and the next decision. Distinguish a producer self-check from independent review.
```

## Expected outputs

Paths below are relative to the target repository unless a central record is named.

- docs/development-spec.md, docs/operating-model-spec.md and docs/commercial-launch-spec.md
- Implemented local tool, synthetic CSV fixtures and behaviour checks
- docs/research-logs/bootstrap.md and central bootstrap.md with actual evidence

## Check the result

- A 10,000-minor-unit invoice with 7,500 paid is reported as 2,500 underpaid.
- Duplicate IDs and mixed currencies produce explicit failures without a misleading report.
- The documented working path runs from a clean workspace without sending source rows externally.

Apply the shared verification rules as well. A structural pass does not establish demand, correct judgement or a successful launch.

## Next decision

Validate the next user workflow and support burden before expanding the tool.
