# Usage

Run commands from the repository with Node.js 24. No third-party packages are needed.
Use a coding agent for research, synthesis, review and execution of skill processes.

## Capture inputs

```bash
node scripts/cli.ts create podcast-project --domain example.com
node scripts/cli.ts create research-project --description "Research a paid industry briefing"
node scripts/cli.ts create game-project --spec /absolute/path/game-spec.md
node scripts/cli.ts create combined-project --domain example.org --description "Explore service and software routes" --spec /absolute/path/spec.md
```

Repeat --spec for multiple files. A domain input does not establish ownership.
Use the chosen stable ID in subsequent commands.

```bash
node scripts/cli.ts ingest game-project /absolute/path/revised-spec.md spec-1 specifications
node scripts/cli.ts ingest game-project /absolute/path/design.pdf design specifications --extract /absolute/path/design-extract.md
node scripts/cli.ts withdraw game-project spec-1 "Superseded by a different requirement"
```

Ingestion copies evidence and marks it pending. Ask the maintaining skill to update
knowledge, claims and calculations. A binary without an extract remains a visible gap.

## Run skills

```bash
node scripts/cli.ts install-skills claude-code
node scripts/cli.ts install-skills cursor
node scripts/cli.ts install-skills codex
```

Choose the command for your tool. Generated copies remain repository-local and
require the shared processes. Repeat installation after editing canonical skills.

Example requests:

- Use case-study-create for research-project. Evaluate distinct routes and potential gains.
- Use case-study-maintain for game-project with the revised specifications.
- Use project-name for podcast-project. Preserve its accepted constraints.
- Use project-query to compare selected commitments and current recommendations.
- Use project-maintain to reconcile target evidence and repair the project wiki.

## Calculate and verify

Populate finance/<option>.model.json from the template and justified assumptions.

```bash
node scripts/cli.ts finance podcast-project
node scripts/cli.ts validate podcast-project
node scripts/cli.ts archive podcast-project
npm run index
npm run check
```

Archive before replacing an existing assessment. Do not change an earlier archive.
The checks cover structure, references and arithmetic. A reviewer checks meaning.

## Check domains

Provide NAMECOM_USERNAME and NAMECOM_TOKEN securely in the environment.

```bash
node scripts/cli.ts domain-check podcast-project example.com
```

The command saves a dated result and raw response. Missing credentials return unknown.
Ask domain-check to interpret fees, restrictions and ownership. This command never buys.

## Bootstrap a selected route

Ask project-bootstrap to resolve the accepted selection and scope, then execute it.
The local scaffold command is:

```text
node scripts/cli.ts bootstrap PROJECT-ID TARGET-PATH PROFILE ACCEPTED-COMMIT
```

PROFILE is assets, services, software, information, matching or goods. TARGET-PATH
must be outside ozeylab. ACCEPTED-COMMIT must exist locally and contain the same
project record, decision record and case. Verify it is the accepted default-branch
revision before running. The command does not create, push or mark a GitHub repo done.
The skill completes real starting assets, checks and the authorised GitHub handover.

Re-running the same scaffold keeps existing edits. A different basis or missing
scaffold files stops the command for reconciliation; it does not overwrite work.

## Scheduled work

```bash
node scripts/cli.ts due
node scripts/automation.ts
```

The default automation writes a queue only. Configure a runner as described in
[Automation](automation.md) to produce candidate maintenance patches.
