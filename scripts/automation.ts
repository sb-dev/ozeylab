import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { json, write, writeJSON, slug, block, projectPath } from './core.ts';
import { dueProjects } from './projects.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = json(path.join(root, 'automation.json'));
const requested = process.env.OZEYLAB_PROJECT;
const processName = process.env.OZEYLAB_PROCESS || 'case-study-maintain';
const allowed = ['case-study-create', 'case-study-maintain', 'project-maintain', 'project-name', 'domain-check'];
const git = (args: string[], raw = false) => {
  const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) throw new Error('Git command failed: ' + args[0]);
  return raw ? r.stdout : r.stdout.trim();
};
try {
  if (!allowed.includes(processName)) throw new Error('Unsupported automated process. Bootstrap requires its accepted scope.');
  const event = process.env.GITHUB_EVENT_PATH ? json(process.env.GITHUB_EVENT_PATH) : null;
  if (event && process.env.GITHUB_REF !== `refs/heads/${event.repository.default_branch}`) throw new Error('Agent automation runs only from the accepted default branch.');
  let queue = requested ? [{ id: slug(requested), budget: block(path.join(projectPath(root, requested), 'project.md')).review.budget }] : dueProjects(root);
  if (event && process.env.GITHUB_EVENT_NAME === 'push') {
    if (!/^[a-f0-9]{40}$/.test(event.before) || /^0+$/.test(event.before)) throw new Error('Cannot resolve the prior push revision. Use an explicit run.');
    const changed = git(['diff', '--name-only', event.before, 'HEAD']).split('\n');
    const ids = [...new Set(changed.map(f => /^projects\/([^/]+)\/sources\//.exec(f)?.[1]).filter(Boolean))];
    queue = ids.map(id => ({ id: slug(id!), budget: block(path.join(projectPath(root, id!), 'project.md')).review.budget }));
  }
  if (!Number.isInteger(config.maxProjectsPerRun) || config.maxProjectsPerRun < 1 || config.maxProjectsPerRun > 10) throw new Error('Invalid project run bound.');
  writeJSON(path.join(root, 'outputs/queue.json'), queue);
  if (!config.enabled) { console.log('Queue generated. Agent execution is disabled in automation.json.'); process.exit(0); }
  if (!config.runner.executable || !config.runner.model || !config.runner.effort || !Array.isArray(config.runner.args)) throw new Error('Configure executable, argument array, actual model and effort.');
  if (git(['status', '--porcelain'])) throw new Error('Start from a clean checkout.');
  const baseline = git(['rev-parse', 'HEAD']);
  for (const item of queue.slice(0, config.maxProjectsPerRun)) {
    const minutes = Math.min(item.budget?.minutes ?? 0, config.maxMinutesPerProject);
    if (!(minutes > 0 && minutes <= 30)) throw new Error('Project needs a positive bounded time budget.');
    const prompt = `Use skills/${processName}/SKILL.md for project ${item.id}. Input revision: ${baseline}. Read AGENTS.md. Modify only projects/${item.id}/ and projects/index.md. Do not commit, push, purchase, send messages or change other projects. Obtain a separate read-only review for material assessments; if unavailable, leave review incomplete. Honour the recorded cash budget, including unknown budgets. Run validation. Preserve selections. Record actual runner/model and checks. Output remains a proposal.\n`;
    const start = new Date().toISOString();
    const run = spawnSync(config.runner.executable, config.runner.args, { cwd: root, input: prompt, encoding: 'utf8', timeout: minutes * 60000, maxBuffer: 4 * 1024 * 1024, shell: false });
    writeJSON(path.join(root, `outputs/${item.id}-run.json`), { project: item.id, process: processName, inputRevision: baseline, startedAt: start, finishedAt: new Date().toISOString(), configuredModel: config.runner.model, effort: config.runner.effort, exitStatus: run.status, error: run.error ? 'Runner failed or timed out' : null });
    // Log output can contain private project material; workflow artifacts inherit repo access.
    write(path.join(root, `outputs/${item.id}-runner.log`), (run.stdout ?? '') + (run.stderr ?? ''));
    if (git(['rev-parse', 'HEAD']) !== baseline) throw new Error('Runner changed Git history. Reject proposal.');
    const changed = [...git(['diff', '--name-only', 'HEAD']).split('\n'), ...git(['ls-files', '--others', '--exclude-standard']).split('\n')].filter(Boolean);
    const authorised = queue.slice(0, queue.indexOf(item) + 1).map(x => `projects/${x.id}/`);
    if (changed.some(f => f !== 'projects/index.md' && !authorised.some(prefix => f.startsWith(prefix)))) throw new Error('Runner changed files outside the declared project scope. Reject proposal.');
    if (run.status !== 0) throw new Error('Agent run failed. Proposed changes are not accepted.');
  }
  const checks = spawnSync(process.execPath, ['scripts/cli.ts', 'validate'], { cwd: root, encoding: 'utf8' });
  write(path.join(root, 'outputs/validation.log'), checks.stdout + checks.stderr);
  if (checks.status !== 0) throw new Error('Candidate validation failed.');
  // Intent-to-add lets the patch include new files. No commit or remote mutation occurs.
  git(['add', '-N', 'projects']);
  write(path.join(root, 'outputs/proposal.patch'), git(['diff', '--binary', 'HEAD'], true));
  console.log('Candidate patch recorded. Review and merge it before treating it as accepted state.');
} catch (error: any) { console.error(error.message); process.exitCode = 1; }
