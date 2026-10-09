# Record contract

## Project metadata

`projects/<stable-id>/project.md` has one JSON block. It is authoritative for
metadata; Markdown beneath it can explain the record. Templates define the shape.
IDs contain lowercase letters, digits and hyphens and survive a rename.

- name, description, objective: accepted identity and purpose. objective is commercial or noncommercial.
- state: captured, assessed, selected, bootstrapped or closed.
- paused and pauseReason: pause without discarding lifecycle state.
- domains: exact names, accepted status, reported/verified ownership and evidence references.
- assessment: revision, date and review path for the current comparison.
- recommendation: current option ID; it can differ from selection.
- selected: option, assessment and decision ID. Change only through an authorised decision.
- target: url, bootstrapCommit, verification path and lastExaminedRevision when available.
- review: nextDate (ISO date or null), cadenceDays, scope and budget (minutes, cash, currency).
- uncertainty and nextAction: the decisive gap and next useful work.

The validator requires actual structure and evidence references. It cannot prove
that a written claim is true. Reviewers must inspect the cited source and run evidence.

## State gates

Captured allows pending sources and an uninitialised ontology.
Assessed requires an assessment revision/date, recommendation, initialised ontology,
review record with result=pass for that assessment, and no pending current source.
Selected also requires a decision matching the recorded selection.
Bootstrapped also requires an exact GitHub URL/commit and structured verification.

Use templates/review.md for assessment review. A bootstrap verification record has
one JSON block with target, commit, result, readBackAt, method, checks and nextWorkUnit.
Each check has a result and output reference or captured output. Include the chosen
profile's acceptance exercise. Remote truth requires actual read-back by the runner;
structural validation alone cannot prove it.

## Sources and knowledge

.wiki/source-registry.md owns one JSON block with sources[]. Each source has a stable
id, origin and versions[]. A version records sha256, path, examinedAt, status,
incorporation, extraction, extract, limitations, affectedPages and run.

status: current, superseded or withdrawn.
incorporation: pending, incorporated or excluded. Explain exclusions in the run log.
extraction: native-text, required or supplied-extract. A supplied extract needs review.
Use a durable URL plus repository/path/revision in the source note for remote inputs.
Original files remain byte-for-byte copies. Reading is not the same as incorporation.

## Finance and history

Use finance/<option>.model.json and generated <option>.results.json.
Every model binds option, assessment, currency and decisionDate. See processes/finance.md.
Archive earlier case, identity and finance under assessments/<revision>/ before revision.
Git records the complete coherent history, including source and wiki changes.
The index never substitutes a new recommendation's finances for the selected route.
When selection and current assessment differ, it shows unknown current funding/hours.
Read the archived assessment for labelled historical figures.

## Repository decisions

Machine-readable JSON stays inside project.md and source-registry.md rather than
creating competing metadata files. Finance uses JSON files for reproducible arithmetic.
The CLI writes atomically per file and serialises local commands with a root lock.
A complete multi-file update is accepted as one reviewed Git change. If interrupted,
inspect the uncommitted diff, rerun checks and finish or discard the whole proposal.
