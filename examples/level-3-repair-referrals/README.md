# L3-05 — Bootstrap a repair referral service

[All examples](../README.md) · [Exercise brief](brief.md)

Walk a qualified request through matching, fees and dispute handling.

**Status: designed, not executed.** Expected outputs below are acceptance requirements, not recorded results.

## Start

Use the [shared run instructions](../RUNNING.md) in a disposable ozeylab checkout. The brief is supplied input; it is not evidence of demand. For this Level 3 exercise, first complete the [accepted-selection preparation](../RUNNING.md#level-3-accepted-selection). The proposed route in the brief is not itself an accepted project record.

```bash
node scripts/cli.ts create example-l3-05 --spec examples/level-3-repair-referrals/brief.md
```
Bootstrap profile: `matching`.


## Exact prompt

```text
Read examples/RUNNING.md and examples/level-3-repair-referrals/brief.md. Follow their evidence, review and execution rules.

Use project-bootstrap for example-l3-05 after the accepted-selection preparation below. Use the matching profile. Define both parties, qualification, coverage, handover, fee trigger, failed matches and disputes. Create the fictional records and walk all three requests through the process. Reconcile one completed-job fee and a disputed completion without charging twice. Keep referral status separate from repair quality and completion evidence. Describe the supplier agreements and first paid outcome still needed. Apply the shared GitHub handover rule before claiming completion.

Report actual output paths, checks performed, unresolved evidence and the next decision. Distinguish a producer self-check from independent review.
```

## Expected outputs

Paths below are relative to the target repository unless a central record is named.

- operations/matching.md with qualification, fee and dispute rules
- Synthetic repairer, request, match, handover and outcome records
- Fee reconciliation and commercial launch dependencies

## Check the result

- Only the qualified in-coverage request is matched.
- An introduction alone does not trigger the completed-job fee.
- A disputed or replayed completion cannot create a duplicate fee.

Apply the shared verification rules as well. A structural pass does not establish demand, correct judgement or a successful launch.

## Next decision

Validate repairer participation and fee terms before opening the service to real requests.
