# ozeylab

**ozeylab is an AI-assisted system for exploring business ideas, evaluating opportunities and turning selected ideas into GitHub projects.**

It helps identify promising projects, compare potential financial returns, and
maintain the evidence behind project decisions.

## How it works

1. **Input:** a domain name, idea, project description, specification files or a combination.
2. **Case study:** research operating models, development options, marketing strategies and financial returns.
3. **Recommendation:** compare alternatives, costs, risks and potential gains.
4. **Project bootstrap:** create the initial repository, specifications and starting assets for the selected route.

Bootstrap means the initial project repository. A separate commercial launch
specification defines the work and funding needed for the first commercial outcome.

## Start

Requires **Node.js 24** and a coding agent. No package installation is needed.

```bash
npm run check
node scripts/cli.ts install-skills claude-code
node scripts/cli.ts create podcast-project --description "Explore a podcast production business"
node scripts/cli.ts index
```

Use `cursor` or `codex` instead of `claude-code` for that tool's local skill folder.
Then ask your agent:

> Use case-study-create for podcast-project. Compare distinct operating models,
> development plans, marketing strategies and financial returns. Recommend one route.

More commands and examples: [Usage](docs/usage.md).

## Core skills

| Skill | Purpose |
| --- | --- |
| case-study-create | Research and evaluate a new opportunity |
| case-study-maintain | Update evidence, forecasts and recommendations |
| project-name | Find suitable product, company and project names |
| domain-check | Check exact domain availability and costs |
| project-bootstrap | Create the selected project's initial repository |
| project-query | Search and compare projects |
| project-maintain | Maintain knowledge, structure and records |

## Architecture

One central repository holds project records, case studies and shared processes.
Each project has sources, a linked wiki, finances, decisions and history.
Selected projects receive separate repositories that own their execution and operations.

- **Production Skills:** production expertise and bootstrap patterns.
- **llm-wiki:** source tracking and maintained project knowledge.
- **Pactwright:** delivery management in generated projects.
- **Prompt Engineering:** reusable prompts and execution history.
- **GitHub Actions:** validation, review-date detection and configured agent execution.

The first four are reuse points, not bundled services. See [Integrations](docs/integrations.md).

## Principles

- **Explore before committing.** Compare distinct business models.
- **Compare financial potential.** Include costs, owner time, funding and no-sale outcomes.
- **Maintain knowledge through agents.** New evidence updates the wiki and assessment together.
- **Preserve decisions.** A new recommendation does not silently change the selected route.
- **Keep projects independent.** ozeylab owns portfolio decisions; target repositories own delivery.

## Repository guide

- [Projects](projects/index.md): generated portfolio navigation.
- [Processes](processes/): workflows executed by the skills.
- [Templates](templates/): records, option profiles, finance and bootstrap profiles.
- [Example](examples/README.md): synthetic service and software cases.
- [Design](docs/specs/repository-design.md): accepted design source.
- [Record contract](docs/record-contract.md): machine-readable fields and lifecycle checks.
- [Automation](docs/automation.md): CI and agent-runner setup.
- [Verification](docs/verification.md): checks and unverified external behaviour.

The tools preserve sources, calculate finances, generate indexes, check records,
check domains and scaffold target workspaces. Research and semantic maintenance
run through the skills. Live registrar checks need credentials. Scheduled agent
runs need a configured runner. Scaffold generation alone does not complete a project bootstrap.
