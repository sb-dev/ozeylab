# Automation

Validation runs on pushes, pull requests and explicit dispatch. It needs no secrets.
Maintenance checks review dates weekly and source changes on the default branch.
Explicit dispatch can select a project and one supported process.

## Enable agent execution

1. Install a chosen coding-agent CLI in maintain.yml before the runner step.
2. Give it the provider credential environment variable it expects.
3. Set automation.json runner.executable and runner.args. The adapter passes a complete prompt on stdin and runs from the checkout root without a shell.
4. Record the actual configured model and effort. Set enabled=true after a bounded fixture run succeeds.

The runner must finish with nonzero exit status on failure. It must honour AGENTS.md,
project scope and the prompt's no-commit/no-push contract. Provider-specific pricing
and budget enforcement belong to that runner. Unknown cash budgets do not authorise spend.
The parent enforces a time limit and project count. It does not impose a financial
limit inside an arbitrary third-party agent.

A configured run preserves its input revision, runner/model configuration, logs and
checks. It rejects changed Git history and edits outside the queued projects/index.
Candidate changes are exported as a patch artifact. Apply it to a branch, review and
merge under repository policy. No automated merge or pull-request posting occurs.
A successful run is not accepted project state. Failed runs leave evidence and the
accepted branch unchanged. Do not upload credentials in agent logs.

Read-only review must use a separate reviewer or analysis pass. If unavailable,
leave semantic review incomplete; never convert structural checks into review approval.
The wrapper is a trusted-runner adapter, not a security sandbox. Use an isolated CI
job with minimal credentials. It checks scope after execution and never publishes it.

Local mutation commands use a repository lock. CI maintenance has serial concurrency.
Only projects/**/sources/** triggers source-change runs; generated indexes do not.
Partial refreshes remain due. Advance review.nextDate only after a complete refresh.
Queue items beyond maxProjectsPerRun remain due for the next run.

Default state: disabled agent execution; queue generation works without credentials.
The shipped workflows have not run on GitHub until this repository is uploaded.
