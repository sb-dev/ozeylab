# L2-04 — Refresh a case after the specification changes

[All examples](../README.md) · [Exercise brief](brief.md)

Update the recommendation while preserving the selected route.

**Status: designed, not executed.** Expected outputs below are acceptance requirements, not recorded results.

## Start

Create the initial record using the command below. Use `case-study-create` to assess initial-spec.md. In the disposable checkout, obtain separate review and record an explicitly authorised exercise selection on its default branch. Keep that accepted commit as the before-state. If review or selection is unavailable, report the missing prerequisite; do not fabricate a passing record. Then run the refresh prompt with revised-spec.md.

```bash
node scripts/cli.ts create example-l2-04 --spec examples/level-2-changed-software-spec/initial-spec.md
```

## Exact prompt

```text
Read examples/RUNNING.md and examples/level-2-changed-software-spec/brief.md. Follow their evidence, review and execution rules.

Use case-study-maintain for example-l2-04 after completing the preparation below. Archive the accepted version-1 assessment before editing it. Ingest revised-spec.md under the original stable source ID spec-1. Trace the offline requirement and reduced capacity through the wiki, serious options, costs, finance and bootstrap scope. Preserve the old source bytes, assessment and selected decision. If the best route changes, update the recommendation and state the conflict. Obtain separate read-only review and update the index. Do not silently switch the selected route, rewrite history or advance the review date after an incomplete refresh.

Report actual output paths, checks performed, unresolved evidence and the next decision. Distinguish a producer self-check from independent review.
```

## Expected outputs

Paths below are relative to `projects/example-l2-04/`.

- assessments/: unchanged prior case, identity and finance
- .wiki/source-registry.md: superseded and current versions under spec-1
- case-study.md and project.md: new recommendation with any selection conflict

## Check the result

- The source registry has one source identity with both versions.
- The selected option, assessment and decision remain unchanged after refresh.
- The index does not show new recommendation finances as selected commitments.

Apply the shared verification rules as well. A structural pass does not establish demand, correct judgement or a successful launch.

## Next decision

Review the changed recommendation. Changing the selected route requires a separate recorded decision.
