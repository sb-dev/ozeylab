import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createProject, indexText } from '../scripts/projects.ts';
import { write, writeJSON, block, setBlock } from '../scripts/core.ts';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function runAutomation(root: string, overrides: Record<string, string> = {}) {
  // Temporary repositories must not consume the enclosing CI job's event or scope.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GITHUB_') && !key.startsWith('OZEYLAB_')));
  return spawnSync(process.execPath, ['scripts/automation.ts'], { cwd: root, encoding: 'utf8', env: { ...env, ...overrides } });
}
function setup(t: any, enabled: boolean, bad = false) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ozeylab-automation-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const part of ['scripts', 'templates', 'skills', 'processes', 'package.json', '.gitignore']) fs.cpSync(path.join(source, part), path.join(root, part), { recursive: true });
  createProject(root, 'example', { description: 'Synthetic automation fixture' });
  const file = path.join(root, 'projects/example/project.md'), p = block(file); p.review.nextDate = '2020-01-01'; setBlock(file, p);
  write(path.join(root, 'projects/index.md'), indexText(root));
  write(path.join(root, 'fixture-runner.mjs'), `import fs from 'node:fs'; let prompt=''; for await (const chunk of process.stdin) prompt+=chunk; if(!prompt.includes('project example')) process.exit(2); fs.appendFileSync('${bad ? 'package.json' : 'projects/example/wiki/index.md'}', '\\n');`);
  writeJSON(path.join(root, 'automation.json'), { enabled, runner: { executable: process.execPath, args: ['fixture-runner.mjs'], model: 'synthetic-runner-no-model', effort: 'fixture' }, maxProjectsPerRun: 1, maxMinutesPerProject: 1 });
  const env = { ...process.env, GIT_AUTHOR_NAME: 'Synthetic fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'Synthetic fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
  const git = (args: string[], input?: string) => { const r = spawnSync('git', args, { cwd: root, env, input, encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr); return r.stdout.trim(); };
  git(['init', '-q']); git(['add', '.']); const tree = git(['write-tree']), commit = git(['commit-tree', tree], 'Synthetic automation fixture\n'); git(['update-ref', 'HEAD', commit]);
  return { root, commit };
}
test('disabled automation creates a queue without executing a runner', t => {
  const { root } = setup(t, false);
  const r = runAutomation(root);
  assert.equal(r.status, 0, r.stderr); assert.match(r.stdout, /disabled/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'outputs/queue.json'), 'utf8'))[0].id, 'example');
  assert.ok(!fs.existsSync(path.join(root, 'outputs/proposal.patch')));
});
test('configured automation exports a candidate without changing accepted Git state', t => {
  const { root, commit } = setup(t, true);
  const r = runAutomation(root);
  assert.equal(r.status, 0, r.stderr);
  assert.match(fs.readFileSync(path.join(root, 'outputs/proposal.patch'), 'utf8'), /projects\/example\/wiki\/index.md/);
  assert.equal(spawnSync('git', ['apply', '--check', '--reverse', 'outputs/proposal.patch'], { cwd: root, encoding: 'utf8' }).status, 0);
  assert.equal(spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout.trim(), commit);
});
test('automation rejects changes outside project scope', t => {
  const { root } = setup(t, true, true);
  const r = runAutomation(root);
  assert.equal(r.status, 1); assert.match(r.stderr, /outside the declared project scope/);
  assert.ok(!fs.existsSync(path.join(root, 'outputs/proposal.patch')));
});

test('explicit push fixtures still reject an unresolved previous revision', t => {
  const { root } = setup(t, false);
  const eventPath = path.join(root, 'outputs/event.json');
  writeJSON(eventPath, { repository: { default_branch: 'main' }, before: '0'.repeat(40) });
  const r = runAutomation(root, { GITHUB_EVENT_PATH: eventPath, GITHUB_EVENT_NAME: 'push', GITHUB_REF: 'refs/heads/main' });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Cannot resolve the prior push revision/);
});

test('explicit event fixtures still reject a branch outside accepted state', t => {
  const { root } = setup(t, false);
  const eventPath = path.join(root, 'outputs/event.json');
  writeJSON(eventPath, { repository: { default_branch: 'main' } });
  const r = runAutomation(root, { GITHUB_EVENT_PATH: eventPath, GITHUB_EVENT_NAME: 'pull_request', GITHUB_REF: 'refs/pull/1/merge' });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /only from the accepted default branch/);
});
