Version 0.2 · 8 October 2026

**ozeylab** is a GitHub repository for managing a portfolio of ideas, case studies and projects. It accepts a domain, an idea or project description, specification files, or any combination. It maintains the evidence, compares complete alternatives, recommends a route, researches suitable names and checks domain availability, and creates the initial GitHub repository for a selected project.

Use one persistent record per project. The case study is the current assessment within that record. Keep its history when the project is revised, selected, bootstrapped or closed.

## 1 Foundations and boundaries

Use Production Skills for the pattern of shared contracts, reusable processes, templates and a registry. Use llm-wiki for source ingestion, linked knowledge, ontology maintenance and independent review. ozeylab owns portfolio decisions and case management; each generated repository owns its current execution specifications and delivery evidence.

The [Production Skills ownership contract](https://github.com/sb-dev/production-skills/blob/ae4c0f1bd63107f9dc33e192bbf2a02a9cab75cf/docs/specs/04-cross-domain-orchestration-and-integration.md) provides the reference for this division. The [llm-wiki process model](https://github.com/sb-dev/llm-wiki/blob/f1cc184acc526ae6c4f327b4ea92302c0a2275bc/AGENTS.md) separates repository instructions, orchestration, reusable skills and independent review.

The implementation uses Markdown, Git and small TypeScript tools. Keep one root `AGENTS.md`. Generate navigation and portfolio summaries from project records. Project facts stay with their records; reusable skill guidance contains methods.

## 2 Inputs and intake

At least one starting input is required. No domain is required when a description or specification provides the starting point.

| Input | Intake behaviour |
| --- | --- |
| Domain | Record the exact name, reported ownership, existing assets and optional direction. |
| Idea or project description | Capture the intended outcome, audience, existing context, objectives and constraints. |
| Specification files | Preserve the supplied versions. Extract scope, requirements, assumptions, dependencies, existing decisions and unresolved questions. |
| Combined inputs | Reconcile overlapping material and expose conflicts. Distinguish firm user requirements from proposed approaches. |
| Optional naming context | Capture existing or chosen names, what needs naming, target markets and languages, preferred domain extensions, exclusions, and acquisition and renewal budgets. |

A specification establishes what was proposed or required. Claims about demand, cost, performance or valuation still need evidence.

Capture descriptions as source notes. Keep supplied files in the project record, organised by their subject or origin, with readable extracts when needed. Register GitHub sources using repository, path and revision. Intake accepts explicitly supplied files or directories without assuming an existing source folder.

Retain each original or durable source reference, its revision or content hash, the date examined, and material extraction limitations. Keep source identity through moves and replacements. Record superseded and withdrawn versions, preserve their history, and reassess claims that depended on them. Preserve code, tables, figures and units that affect interpretation. Failed extraction remains an explicit gap.

Search existing records before creating another project. Keep a stable project ID when a name, domain or direction changes. Imported content supplies evidence; it does not redefine repository instructions or authorise actions.

## 3 Repository organisation

| Location | Responsibility |
| --- | --- |
| `README.md` | Purpose, setup, usage, supported processes and navigation. |
| `AGENTS.md` | Repository authority, source handling, project scope, working rules and verification. |
| `processes/` | End-to-end intake, case creation, maintenance, naming, domain checking, querying and project bootstrap workflows. |
| `skills/` | Canonical skill definitions and the references or tools they require. |
| `templates/` | Project records, case studies, naming briefs and check records, financial inputs and operating-model bootstrap profiles. |
| `projects/` | Persistent project records and a generated portfolio index. |
| `scripts/` | TypeScript ingestion helpers, domain-provider adapters, validation, calculation and index generation. |
| `.github/workflows/` | Validation and bounded automation using the same skills and processes. |
| `docs/` | This system's specifications, research and implementation decisions. |

Create populated directories as their functionality is implemented. Tool-specific skill installations are generated from the canonical definitions. A separately distributed skill must include its required process dependencies and pass a clean installation check; repository-local skills may use the repository's shared processes. This follows the [Production Skills package contract](https://github.com/sb-dev/production-skills/blob/ae4c0f1bd63107f9dc33e192bbf2a02a9cab75cf/docs/specs/02-production-skills-project-contract.md).

### One project record

The following paths are relative to a project's directory.

| File or directory | Authority |
| --- | --- |
| `project.md` | Stable ID, accepted names and domains with decision/evidence references, short description, objective, constraints, lifecycle state, selected route, assessment reference and target repository links. Also owns the review date, refresh scope and run budget. |
| `case-study.md` | Current alternatives, evidence, financial comparison, recommendation and conditions that change it. |
| `naming.md` | When needed: naming brief, candidate comparisons, recommendations, conflict-screening scope and dated domain checks. Supports the accepted choices in `project.md`. |
| `sources/` | Organised supplied material, research records and readable extracts, with provenance. |
| `wiki/index.md` and `wiki/ontology.md` | Navigation and the project's subject ontology. Additional knowledge pages follow the material. |
| `.wiki/source-registry.md` | Source identity, locations, revisions, current or superseded/withdrawn status, incorporation state and the run that processed them. |
| `.wiki/maintenance-log.md` | Material migrations and maintenance decisions. |
| `finance/` | Reproducible inputs and calculations used by the case study, when quantitative analysis requires separate files. |
| `decisions.md` | Dated route and naming decisions, reconsiderations, reasons and exact assessment or naming-evidence revisions. |
| `bootstrap.md` | Selected repository scope, generation plan and, after execution, verified handover references. |

The fixed project record describes management responsibilities. Derive the subject ontology from the actual material. A podcast, service and software product can organise their knowledge differently.

The portfolio index is a generated view. It links to each project and shows its state, selected route, required cash and owner time, assessment date, decisive uncertainty and next action. Bind financial figures to an option ID and assessment revision, with currency and period. Show a conflicting current recommendation separately from the selected route. If the selected route lacks a current forecast, show that gap. Store values once and derive their summaries.

## 4 Lifecycle and skills

Use five states: **captured**, **assessed**, **selected**, **bootstrapped** and **closed**. Allow a paused flag with a reason at any state. An existing project can be imported at its observed stage.

Assessed means a usable comparison and recommendation exist. Selected means the route has been chosen through an explicit decision or an instruction that already authorises it. Bootstrapped means the agreed initial repository exists and its completion checks have recorded results. Revising a case preserves earlier decisions and the current selection until it is changed deliberately.

### Initial skills

| Skill | Work | Completion evidence |
| --- | --- | --- |
| `case-study-create` | Capture inputs, initialise or update the project wiki, research distinct alternatives, model finances, challenge the comparison and recommend a route. | Traceable case study, financial calculations, material uncertainties, independent review and a refreshed portfolio index. |
| `case-study-maintain` | Incorporate new evidence and project results; update affected assumptions, options, calculations and recommendations. | A reviewed change with the previous assessment preserved, current evidence dates and any selection conflict identified. |
| `project-bootstrap` | Turn the selected case revision into a custom bootstrap process and initial GitHub repository. Support planning, creation and resuming incomplete setup. | Target repository, required starting contents, recorded checks and two-way versioned references. |
| `project-query` | Answer questions about one project or compare projects using their maintained records and sources. | An evidence-linked answer with matching periods and uncertainty preserved. Queries do not mutate records. |
| `project-maintain` | Repair knowledge structure, reconcile target repository status, migrate ontologies, maintain links and regenerate portfolio navigation. | Consistent records, navigation and ontology; material changes reviewed; affected assessments routed through case maintenance. |
| `project-name` | Develop and compare project, product, company, brand and domain names against a brief; check the strongest candidates through `domain-check`. | A reasoned shortlist, scoped conflict findings, dated domain checks and a recommendation; any accepted choice recorded separately. |
| `domain-check` | Check exact domains through live registrar or registry availability services, independently or for `project-name`. | Provider evidence, check time, registration status, costs and restrictions; ownership and resale findings recorded separately; unresolved checks marked unknown. |

Skills invoke canonical process files rather than duplicate their orchestration. Shared intake and wiki procedures serve both creation and maintenance. Validation is a shared TypeScript command invoked by mutating processes.

Use bounded research and synthesis work with independent, read-only challenge where needed. Retain llm-wiki's ontology-librarian and reviewer responsibilities. The coordinating process owns final record, registry and navigation updates.

Each run declares the project scope, input revision, process or skill revision, output files and completion criteria. Record the runner, model settings where applicable, run link and actual checks. Reuse prompt-engineering records where available.

### Naming and domain checks

Run naming when requested or when a project needs a name. It can support an individual case-study option or the selected route. A chosen name remains a requirement unless a rename is requested. **ozeylab** is this project's accepted name; its domain is still to be selected and checked. Keep the stable project ID when an accepted display name changes.

**`project-name` process.** Establish what is being named, its operating model, positioning, audience, tone, markets and languages. Record existing names, exclusions, allowed domain extensions, and acquisition and renewal budgets. Generate alternatives across distinct approaches such as descriptive, suggestive, invented and compound names. Compare meaning, memorability, pronunciation, spelling, distinctiveness and scope for growth. An available domain alone does not make a name suitable.

Screen the strongest candidates for obvious product and brand collisions; use company and trade mark registers when relevant to the intended jurisdictions. Record the search scope and findings separately from domain availability, without treating preliminary screening as legal clearance. Invoke `domain-check` for a short list of exact domain candidates. Normally present three to five differentiated name options, with domain choices, costs, trade-offs and a recommendation. Rework the candidates or report unresolved constraints when none meets the brief. Only recommend a name as ready to register when a live check confirms a suitable domain within budget; keep resale or unverified choices conditional. A registered domain with verified user ownership can be a usable choice.

**`domain-check` contract.** Use a live availability response from a registrar or registry for each exact domain and extension. Record both displayed and ASCII forms for internationalised domains. Save the provider, UTC check time and supporting response or link. Registration status must distinguish:

| Status | Required interpretation |
| --- | --- |
| Available to register | The provider explicitly reports registerability at the check time. |
| Registered | Registration evidence establishes an existing registration. |
| Restricted, reserved or otherwise unavailable | Record the provider's stated reason; do not infer registration from an unavailable result. |
| Unknown | No authoritative availability result, or an unresolved access failure, timeout or conflict. |

Keep standard or premium pricing, observed resale listings and reported or verified ownership as separate attributes. A resale asking price is an acquisition possibility, not an available registration. Record quoted initial registration or acquisition cost, renewal cost, currency, term, material fees and eligibility conditions where available; missing prices stay unknown. Preserve evidence in `sources/` and reference it from `naming.md`.

A missing website, failed DNS lookup or absent RDAP/WHOIS result cannot establish availability. RDAP supplies registration data; registrar checks can explicitly return availability and premium registration/renewal prices. These distinctions inform the contract; the implementation can use any suitable provider. Sources: [ICANN RDAP overview](https://www.icann.org/en/contracted-parties/registry-operators/resources/registration-data-access-protocol) and [Namecheap availability API](https://www.namecheap.com/support/api/methods/domains/check/).

Refresh the chosen domain check at selection and bootstrap, and immediately before any separately authorised registration. An availability result does not reserve a domain; acquisition is complete only with transaction evidence. A failed refresh retains the earlier dated result as history and leaves current availability unknown. Domain checking must not silently rename a project or register a domain. `project.md` owns accepted names and domains, `decisions.md` records choices and changes, and `naming.md` holds their supporting evidence.

## 5 Case study creation and financial assessment

Import the accepted [Project Case Study Workflow](https://chatgpt.com/space/page_10bcbf9a9ef48191b47acf638fe3cc66) into the canonical repository process, retaining its source version. Execute the checked-in rules at the recorded repository revision. The Page is the source reference; automated runs use the versioned repository files.

Inspect the supplied material, then compare complete alternatives across the relevant operating families: assets and rights, services, software and tools, information and access, matching and transactions, and goods and fulfilment. Screen every family and record exclusions. Do not label marketing channels or development phases as separate business alternatives.

Each serious option includes its intended users and outcome, operating model, development method, distribution, funding and ownership, financial assessment, and an initial repository outline. Add the payer, revenue mechanism, marketing and sales for commercial options. Respect firm requirements while challenging assumptions. Detailed specifications do not make the proposed route economically preferable by default.

Use a relevant baseline. Include domain sale when an owned domain is part of the decision. Otherwise compare with no new commitment, continuing the current approach, or an available asset sale. Do not invent a domain asset.

### Financial outputs

For each serious option, calculate setup cash and owner hours, remaining work, peak funding needs, downside/central/upside scenarios, and the thresholds that can change the ranking. For commercial options, also calculate time to first cash, cash recovery, operating cash after costs and owner economic result. Include conditional sale proceeds and a no-sale outcome when sale is a credible route. Include required domain acquisition, registration, renewal and transfer costs once in the relevant option and launch funding. Reference the dated quotes; distinguish resale asking prices from agreed costs and include unresolved costs in the uncertainty analysis.

Use the workflow's default GBP reporting and 90-day, 12-month and 36-month comparisons unless another basis is appropriate. Label reporting choices and assumptions. Revenue, cash, owner compensation, finance received and sale proceeds remain distinct.

For an explicitly noncommercial objective, assess cost, funding, capacity and the intended outcome. Quantify income or savings only where a credible mechanism exists. Keep uncertain values unknown rather than filling them with zero.

Recommend one route and one credible alternative. A recommendation may be conditional on important unknowns. Holding, pausing or closing a case are valid outcomes.

## 6 Maintaining knowledge and decisions

Follow the [llm-wiki ingestion process](https://github.com/sb-dev/llm-wiki/blob/f1cc184acc526ae6c4f327b4ea92302c0a2275bc/processes/ingest.md): identify what a source changes in the existing knowledge, preserve disagreement, and update related pages.

For each material update:

1. Read the current project record, ontology, case study and relevant decisions.

2. Identify the changed source revision and affected claims.

3. Incorporate its additions, contradictions or invalidations into the project wiki.

4. Update dependent financial inputs and calculations together.

5. Reconsider alternatives when the change could affect the ranking.

6. Record changes to the recommendation and any conflict with the selected route.

7. Prepare the matching source-registry, navigation and portfolio-summary changes with the assessment update.

8. Review and validate the complete candidate change. Commit all affected records together and read back the accepted revision before reporting the run complete.

Use the [maintenance process](https://github.com/sb-dev/llm-wiki/blob/f1cc184acc526ae6c4f327b4ea92302c0a2275bc/processes/maintenance.md) for demonstrated structural problems. An ontology migration updates the ontology, affected pages, links and index together.

Preserve original forecasts through versioned assessments and decision references. Report actual performance against the earlier forecast separately from a new decision based on future costs and benefits. Inaccessible evidence remains unresolved; it does not become a successful refresh.

Portfolio totals include actual results and selected commitments. Count shared money and capacity once. Keep mutually exclusive alternatives and conditional sale values out of realised earnings.

### Required llm-wiki adaptations

The existing [TypeScript linter](https://github.com/sb-dev/llm-wiki/blob/f1cc184acc526ae6c4f327b4ea92302c0a2275bc/scripts/wiki-lint.ts) resolves one root wiki. Adapt its helpers to receive an explicit project directory. Scope page-name uniqueness to that project and require explicit cross-project links.

Add source revision tracking and checks for meaningful completion. A present but uninitialised ontology is acceptable for a captured record; it cannot establish completed case creation. Exclude management instructions, generated wiki content and automation output from source discovery unless deliberately included.

## 7 Turning a selected case into a project

Bootstrap means **the initial GitHub repository used to start the project**. For a commercial project, specify work and funding through the first commercial outcome in `docs/commercial-launch-spec.md`. For an explicitly noncommercial project, use `docs/launch-spec.md` for the first useful operational outcome, users, distribution, funding and acceptance.

Use the [Production Skills bootstrap method](https://github.com/sb-dev/production-skills/blob/ae4c0f1bd63107f9dc33e192bbf2a02a9cab75cf/docs/bootstrap/new-project-process.md):

1. Resolve the selected case revision, target repository, operating model, accepted names and domains, and scope of initial setup. Refresh relevant domain checks and record any acquisition dependency.

2. Create or reuse the small target repository.

3. Persist the project-specific bootstrap specification under `docs/research-logs/`.

4. Review existing evidence and execute the required setup stages with recorded outputs.

5. Populate the operating-model specification, appropriate launch specification, instructions and agreed starting assets.

6. Run applicable checks and read back the resulting GitHub state.

7. Record the target URL and bootstrap commit in the central project record.

Each bootstrap stage defines inputs, work, outputs, dependencies, budget and exit criteria. A plan records future work; completion requires its evidence. Resume from recorded results after interruption rather than creating another repository. Carry accepted names and domain evidence into the starting specifications. Repository creation can proceed while domain acquisition remains an explicit launch dependency.

### Operating-model profiles

| Model | Examples of starting contents |
| --- | --- |
| Assets and rights | Editable assets, positioning and listing material, rights inventory and transfer instructions. |
| Services | Offer, intake, quotation inputs, delivery procedures, sample output and review criteria. |
| Software and tools | Product and development contracts, code or configuration, setup instructions and checks for implemented behaviour. |
| Information and access | Editorial or research method, content or data formats, source records and publication process. |
| Matching and transactions | Qualification, intake, matching, fee and handover rules, with representative records. |
| Goods and fulfilment | Product specifications, catalogue, unit costs, supplier requirements and fulfilment checks. |

Profiles determine real output and verification requirements. Add technology and automation because the selected operation requires them. Research depth follows the business; Production Skills' product-specific corpus, examples and Extension Pack requirements apply when the target itself is that kind of skills product.

### Handover and continuing ownership

The target records the central project ID, case path and accepted commit. The central record stores the target repository, bootstrap commit and last examined revision.

The central repository owns the comparative case, selection history and portfolio constraints. The target owns current project specifications, delivery knowledge and execution results. Transfer relevant seed knowledge and sources with provenance when the target needs its own wiki; establish that execution scope as target-owned.

Keep the accepted case as a versioned reference or clearly labelled historical snapshot. Do not maintain two editable versions of the same current specification. Case maintenance reads target evidence and updates the central assessment; a revised recommendation does not silently rewrite the target's operating model.

## 8 Automation

GitHub Actions and agent tools run the same processes. The [current llm-wiki tree](https://github.com/sb-dev/llm-wiki/tree/f1cc184acc526ae6c4f327b4ea92302c0a2275bc) supplies agent procedures and a linter; event-driven and scheduled execution are additions to this project.

| Trigger | Action |
| --- | --- |
| New, changed, superseded or withdrawn inputs | Detect the affected project and source revisions; run intake and case creation or maintenance. |
| Explicit naming, domain-check, refresh or bootstrap request | Run the requested skill for the named project and recorded scope; selection and bootstrap refresh relevant domain evidence. |
| A case reaches its configured review date | Refresh material time-sensitive evidence within the run budget. |
| A naming brief or domain result changes | Refresh affected candidates or checks and route material cost or feasibility changes through case maintenance. Preserve accepted names until a new choice is made. |
| Target project evidence is refreshed | Reconcile observed status and actual costs or results; update the affected case. |
| A pull request changes records, skills or processes | Run applicable deterministic checks and independent semantic review. |

Use one active writer per project. Runs on different projects may proceed independently; regenerate shared indexes serially or during integration. Check the current revision before applying changes.

The repository's configured default branch holds current accepted records. A pull request remains proposed until merged; a completed candidate run does not make its assessment or source-processing state current. Bootstrap uses the accepted selection and exact case revision. Direct commits follow repository policy.

PR review is read-only. Corrections run through the relevant producing process against the current revision. Keep failed runs and incomplete reviews visible. Advance accepted content, processing state and generated views together after the resulting commit or merge is verified.

A successful refresh advances the next review date using the project's configured cadence. A partial or failed refresh remains due and records the unresolved work. Update evidence dates only for sources actually verified; retries remain within the authorised run budget.

Exclude generated outputs from ingestion triggers to prevent repeated self-triggering. A repeated run on the same inputs should produce no duplicate records, conflicting state or unnecessary content changes.

Routine maintenance may proceed under standing authorisation. Starting the chosen project uses its recorded selection and agreed bootstrap scope. External commercial commitments follow their own authorisation; scheduled assessment does not itself authorise business spending.

## 9 Reuse of the wider tooling

Select relevant Production Skills for research, business analysis and the target's production discipline. Inspect the owning repository and available implementation before binding a capability. Record revisions and gaps.

Use Pactwright for project delivery and prompt-engineering for reusable prompts, tool-specific implementations and run evidence. Keep integration decisions in the consuming repository. Shared skills express the work and its evidence requirements; the chosen execution tools perform it.

Repository-local use must work with its documented dependencies. Independent skill distribution requires bundled dependencies and clean consumer validation. Public examples use material intended for publication; private project records remain in an appropriate private workspace.

## 10 Implementation sequence and acceptance

1. **Project records and intake.** Establish the record contract, preserve sources, adapt wiki tools to project scope and generate the index.

2. **Case creation, maintenance and naming.** Implement the two case skills, `project-name` and `domain-check`. Prove source-to-assessment updates, reproducible calculations, evidence-backed naming recommendations and independent review. Start domain checking with one live provider adapter and explicit unknown-result handling.

3. **Project bootstrap and query.** Generate and verify a target repository from a selected case. Prove the ownership handover and answer questions across maintained records. Include accepted names, refreshed domain evidence and acquisition dependencies in the handover.

4. **Automated operation.** Add event and review-date execution, recovery, scope checks and review. Exercise the same processes through GitHub Actions.

Acceptance covers domain-only, description-only, specifications-only and combined-input cases. Include a noncommercial objective, conflicting and withdrawn specifications, changed evidence, a failed extraction, repeated ingestion and two projects with identically named wiki pages. Verify that a changed recommendation cannot replace the selected route's financial summary, and that unmerged or failed runs cannot advance accepted state.

Naming acceptance covers an existing chosen name, an unnamed project and an owned domain. Domain-check fixtures cover standard and premium registration, registered domains with resale listings, restricted/reserved names, absent websites or DNS, failed or conflicting lookups, unknown renewal prices and stale checks. Verify that the shortlist respects the brief, uncertainty is preserved, and a domain result cannot silently change an accepted name or imply ownership.

Demonstrate bootstrap with both a software project and a project whose deliverable is a service, publication or physical product. Verify that their initial contents and checks differ appropriately. Validate additional profiles before claiming them ready.

A completed workflow must leave traceable sources, consistent knowledge, reproducible financial outputs, preserved decisions, an accurate index and recorded verification. A completed bootstrap must also leave an accessible target repository with the agreed initial contents and a usable next work unit.

