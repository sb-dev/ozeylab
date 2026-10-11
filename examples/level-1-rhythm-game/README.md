# L1-03 — Challenge a rhythm-game specification

[All examples](../README.md) · [Exercise brief](brief.md)

Separate a detailed product idea from a supported business case.

**Status: designed, not executed.** Expected outputs below are acceptance requirements, not recorded results.

## Start

Use the [shared run instructions](../RUNNING.md) in a disposable ozeylab checkout. The brief is supplied input; it is not evidence of demand.

```bash
node scripts/cli.ts create example-l1-03 --spec examples/level-1-rhythm-game/brief.md
```

## Exact prompt

```text
Read examples/RUNNING.md and examples/level-1-rhythm-game/brief.md. Follow their evidence, review and execution rules.

Use case-study-create for example-l1-03. Preserve the supplied specification and its fixed creative requirements. Compare the three game-related routes against doing no new work. Screen the other operating families with reasons for exclusion. Separate specified behaviour from claims about player demand, platform access, rights and production effort. Include art, music, testing, distribution and support work in the comparison. Recommend a next experiment and a conditional route. Do not build the game or claim the specification validates demand.

Report actual output paths, checks performed, unresolved evidence and the next decision. Distinguish a producer self-check from independent review.
```

## Expected outputs

Paths below are relative to `projects/example-l1-03/`.

- sources/: byte-preserved input specification
- case-study.md: route comparison and requirements-versus-assumptions
- bootstrap.md: distinct starting-repository outlines for the serious routes

## Check the result

- Pixel art remains a requirement in every retained route.
- Music rights and platform dependencies remain explicit.
- Development cost is not used as evidence of resale value.

Apply the shared verification rules as well. A structural pass does not establish demand, correct judgement or a successful launch.

## Next decision

Gather player or buyer evidence for the recommended route before selecting its initial repository scope.
