# ozeylab

**A place to explore ideas and test their financial potential.**

ozeylab turns a domain, idea, project description or specification into a maintained case study. It compares ways to pursue the opportunity, recommends a route, and creates the initial GitHub repository for a selected project.

It supports software, services, publications, creative work, physical products and noncommercial projects. Each case keeps its evidence, costs, owner workload, decisions and history together.

## What you can do

- **Explore an opportunity.** Compare distinct operating models and the choice to make no new commitment.
- **Compare financial potential.** Include setup costs, acquisition, delivery, owner time, funding gaps and no-sale outcomes.
- **Find a name.** Compare candidates and dated domain evidence against a naming brief.
- **Maintain a case.** Incorporate new sources and actual results without losing earlier decisions.
- **Compare projects.** Identify commitments, shared capacity and the next useful investigation.
- **Bootstrap a selected route.** Create the specifications and working assets needed to start that particular project.

## From idea to project

1. **Capture** the inputs and preserve their source versions.
2. **Assess** serious alternatives, their economics and the evidence that could change the choice.
3. **Select** a route through a recorded decision.
4. **Bootstrap** its initial repository and verify the agreed starting contents.
5. **Maintain** the case as evidence, costs and results change.

A recommendation can change while an earlier selection remains in force. Bootstrap means the initial repository. The launch specification defines the later work and funding needed for the first commercial or useful operational outcome.

## Setup

Requires **Node.js 24**, Git and a coding agent. The repository uses Node.js built-ins; no package installation is needed.

```bash
git clone https://github.com/sb-dev/ozeylab.git
cd ozeylab
npm run check
node scripts/cli.ts install-skills claude-code
```

Use `cursor` or `codex` instead of `claude-code` for that agent's local skill directory. Inspect existing installed copies before reinstalling: the command overwrites them from canonical `skills/` files. These skills use shared files in this checkout and are not standalone packages.

## Quick start — explore a coffee blog

Use a disposable checkout for this synthetic exercise:

```bash
node scripts/cli.ts create example-l1-01 --spec examples/level-1-coffee-blog/brief.md
node scripts/cli.ts index
```

Then give your agent this prompt:

```text
Read examples/RUNNING.md and examples/level-1-coffee-blog/README.md. Execute its exact prompt for example-l1-01 using case-study-create. Compare the operating models, costs, owner work and evidence gaps. Recommend one route and one credible alternative. Keep the recommendation separate from selection. Report actual files, checks and the next decision.
```

The expected result is an evidence-linked comparison, financial scenarios and a conditional recommendation. This guide is designed, not an already completed market study. For your own project, use a description, domain or specification with the [intake commands](docs/usage.md#capture-inputs).

## Learn by exploring

Start with one opportunity, then work through economic trade-offs and project handover. **All 15 guides are designed exercises, not recorded end-to-end results.** Each has an exact prompt, supplied brief and acceptance checks.

### Level 1 — Explore an opportunity

Start from an idea, domain, specification or naming brief. Identify viable routes and the evidence needed for the next decision.

| Example | What you learn |
| --- | --- |
| [L1-01 — Explore a coffee blog](examples/level-1-coffee-blog/README.md) | Compare ways to earn from one topic before choosing what to build. |
| [L1-02 — Explore an unused domain](examples/level-1-unused-domain/README.md) | Work from a domain without inventing its value or ownership. |
| [L1-03 — Challenge a rhythm-game specification](examples/level-1-rhythm-game/README.md) | Separate a detailed product idea from a supported business case. |
| [L1-04 — Name a mobile bicycle-repair service](examples/level-1-bicycle-repair-name/README.md) | Compare names and domain evidence within a clear brief. |
| [L1-05 — Plan community repair sessions](examples/level-1-community-repair/README.md) | Assess a useful noncommercial outcome without inventing revenue. |

### Level 2 — Compare and maintain a case

Resolve economic trade-offs, changed evidence and shared constraints. Preserve earlier decisions.

| Example | What you learn |
| --- | --- |
| [L2-01 — Sell a podcast package or run a service](examples/level-2-podcast-package-or-service/README.md) | Compare asset sale, no sale and retained delivery on the same basis. |
| [L2-02 — Compare children’s audio-story businesses](examples/level-2-childrens-audio/README.md) | Model creative rights, production capacity and different payers. |
| [L2-03 — Compare coffee sampler fulfilment routes](examples/level-2-coffee-sampler-economics/README.md) | Expose the cash gap hidden by a positive per-order margin. |
| [L2-04 — Refresh a case after the specification changes](examples/level-2-changed-software-spec/README.md) | Update the recommendation while preserving the selected route. |
| [L2-05 — Choose the next portfolio investigation](examples/level-2-portfolio-capacity/README.md) | Compare projects without spending the same time or cash twice. |

### Level 3 — Bootstrap a selected project

Turn an accepted route into useful starting assets, exercise them, and prepare a versioned handover.

| Example | What you learn |
| --- | --- |
| [L3-01 — Bootstrap an invoice reconciliation tool](examples/level-3-reconciliation-tool/README.md) | Build and check one local CSV-to-report workflow. |
| [L3-02 — Bootstrap a podcast production service](examples/level-3-podcast-service/README.md) | Create operating assets that can deliver one reviewed sample. |
| [L3-03 — Bootstrap a paid industry briefing](examples/level-3-industry-briefing/README.md) | Produce one sourced issue and test the publication process. |
| [L3-04 — Bootstrap a coffee sampler operation](examples/level-3-coffee-sampler-operation/README.md) | Reconcile an order, stock, costs and a return. |
| [L3-05 — Bootstrap a repair referral service](examples/level-3-repair-referrals/README.md) | Walk a qualified request through matching, fees and dispute handling. |

See [all examples](examples/README.md), [run instructions](examples/RUNNING.md), and the [45 candidates and selection reasons](examples/selection.md).

## Project structure grows with the work

The CLI creates one stable project record. Add research and delivery detail as the case needs it.

| Work | Records used |
| --- | --- |
| Capture an idea | `project.md`, preserved `sources/` and source registry |
| Assess alternatives | `case-study.md`, source-linked `wiki/`, `finance/` and review evidence |
| Research a name | `naming.md` and dated domain checks |
| Make or revise a decision | `decisions.md` and preserved `assessments/` |
| Prepare the selected repository | `bootstrap.md`, accepted case revision and target verification |

Paths above are inside `projects/<stable-id>/`. The generated [portfolio index](projects/index.md) links to those records. It keeps selected commitments separate from revised recommendations.

## Core skills

| Skill | Responsibility |
| --- | --- |
| [case-study-create](skills/case-study-create/SKILL.md) | Research a new opportunity, compare routes and recommend one |
| [case-study-maintain](skills/case-study-maintain/SKILL.md) | Refresh evidence, finances and recommendations while preserving history |
| [project-name](skills/project-name/SKILL.md) | Compare suitable names against audience, language and cost constraints |
| [domain-check](skills/domain-check/SKILL.md) | Record exact domain availability, costs, restrictions and uncertainty |
| [project-bootstrap](skills/project-bootstrap/SKILL.md) | Execute the selected starting-repository scope and verify handover |
| [project-query](skills/project-query/SKILL.md) | Answer evidence-linked project and portfolio questions without changing records |
| [project-maintain](skills/project-maintain/SKILL.md) | Maintain project knowledge, links and target-state records |

## Bootstrap profiles

The selected operating model determines the starting assets and checks.

| Profile | Starting contents | Acceptance exercise |
| --- | --- | --- |
| [Assets and rights](templates/bootstrap/assets.json) | Editable assets, rights, listing and transfer instructions | Preview, export and rehearse transfer |
| [Services](templates/bootstrap/services.json) | Offer, intake, quotation, procedure and sample | Walk a sample through costing, delivery and review |
| [Software and tools](templates/bootstrap/software.json) | Behaviour contract, code, setup and checks | Run setup and the claimed core behaviour |
| [Information and access](templates/bootstrap/information.json) | Editorial method, sources, format and sample | Produce an item and check its export |
| [Matching and transactions](templates/bootstrap/matching.json) | Qualification, matching, fees and handover | Walk a sample through matching and outcome handling |
| [Goods and fulfilment](templates/bootstrap/goods.json) | Product, supplier, stock, order and cost records | Reconcile an order and its exceptions |

Scaffolding creates a planned workspace. The bootstrap skill must complete the agreed assets, run the checks and read back GitHub before recording a completed bootstrap.

## Execution and integrations

The TypeScript tools preserve inputs, calculate finances, generate navigation, validate records, check domains and create scaffolds. Coding agents perform research, synthesis and maintenance through the skills. Material assessments need a separate read-only reviewer.

Live domain checks require registrar credentials. Missing access produces an unknown result. Scheduled maintenance writes a queue by default; agent execution requires a configured runner. See [automation](docs/automation.md).

Production Skills provides production expertise, llm-wiki informs knowledge maintenance, Pactwright can manage target delivery, and Prompt Engineering can manage prompts and run history. These are integration points whose contracts must be inspected when used. See [integrations](docs/integrations.md).

## Verification

```bash
npm run check
```

This runs automated tests, structural and calculation validation, and a generated-index check. It does not establish demand, legal clearance, sound commercial judgement or completed target delivery. Use the example-specific checks and independent review for those parts of a run.

See the [verification record](docs/verification.md) for its dated results and limits. The [synthetic service case](examples/service-case/case-study.md) supplies reproducible financial fixtures.

## Documentation

- [Usage](docs/usage.md): intake, skills, calculations, domains and bootstrap commands.
- [Repository design](docs/specs/repository-design.md): ownership, lifecycle and records.
- [Case study workflow](docs/specs/case-study-workflow.md): option coverage and financial assessment.
- [Record contract](docs/record-contract.md): fields, evidence and lifecycle gates.
- [Bootstrap process](docs/bootstrap/new-project-process.md): stages and handover.
- [Processes](processes/): canonical skill workflows.

## Project boundary

ozeylab owns comparative cases, portfolio decisions and selection history. Target repositories own current delivery specifications and execution results. Spending, purchases, messages and other external commitments need authority for that action.

## Contributing

Read [AGENTS.md](AGENTS.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Preserve source identity and decision history. Run required checks before committing, and keep synthetic examples separate from live evidence.

## Licence

No project licence is currently recorded in this repository.
