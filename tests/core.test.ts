import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { block, setBlock, read, write, writeJSON } from '../scripts/core.ts';
import { createProject, ingest, withdraw, indexText, dueProjects, installSkills } from '../scripts/projects.ts';
import { calculate } from '../scripts/finance.ts';
import { checkDomain, interpret, normaliseDomain } from '../scripts/domain.ts';
import { validate } from '../scripts/validate.ts';
import { bootstrap } from '../scripts/bootstrap.ts';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function workspace(t: any) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ozeylab-'));
  for (const part of ['templates', 'skills', 'processes']) fs.cpSync(path.join(repo, part), path.join(dir, part), { recursive: true });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
const event = (day: number, order: number, kind: string, amount: number | null) => ({ day, order, kind, amount, basis: 'Synthetic test input' });
const model = (events: any[], extra: any = {}) => ({ option: 'package', assessment: 'a001', currency: 'GBP', decisionDate: '2026-10-08', ownership: 'wholly-owned', hourlyValue: 50, horizons: [365, 1095], scenarios: [{ id: 'central', events, hours: [{ day: 0, hours: 80, basis: 'Synthetic' }] }], ...extra });
function fixtureCommit(root: string) {
  const git = (args: string[], input?: string) => {
    const r = spawnSync('git', args, { cwd: root, input, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 'Synthetic fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'Synthetic fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' } });
    assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
  };
  git(['init', '-q']); git(['add', '.']); const tree = git(['write-tree']);
  return git(['commit-tree', tree], 'Synthetic test fixture\n');
}

test('intake accepts each input form and preserves source bytes', t => {
  const root = workspace(t), spec = path.join(root, 'spec.md'); write(spec, '# Technical spec\n\n`selection.through: CP01-S01`\n');
  createProject(root, 'domain', { domain: 'example.com' });
  createProject(root, 'idea', { description: 'A publication' });
  createProject(root, 'spec', { specs: [spec] });
  createProject(root, 'combined', { domain: 'example.org', description: 'A service', specs: [spec] });
  assert.deepEqual(validate(root), []);
  const reg = block(path.join(root, 'projects/spec/.wiki/source-registry.md'));
  assert.equal(read(path.join(root, 'projects/spec', reg.sources[0].versions[0].path)), read(spec));
  assert.throws(() => createProject(root, 'empty', {}));
  assert.throws(() => createProject(root, '../escape', { description: 'bad' }));
  assert.throws(() => createProject(root, 'idea', { description: 'duplicate' }));
});

test('ingestion is idempotent, retains revisions and handles withdrawal', t => {
  const root = workspace(t); createProject(root, 'idea', { description: 'A service' });
  const source = path.join(root, 'brief.md'); write(source, '# One\n');
  assert.equal(ingest(root, 'idea', source, 'brief', 'offer').changed, true);
  assert.equal(ingest(root, 'idea', source, 'brief', 'offer').changed, false);
  write(source, '# Two contradicts One\n'); ingest(root, 'idea', source, 'brief', 'offer');
  let reg = block(path.join(root, 'projects/idea/.wiki/source-registry.md'));
  assert.equal(reg.sources[1].versions[0].status, 'superseded');
  withdraw(root, 'idea', 'brief', 'User withdrew the specification');
  reg = block(path.join(root, 'projects/idea/.wiki/source-registry.md'));
  assert.equal(reg.sources[1].versions[1].status, 'withdrawn');
  assert.equal(reg.sources[1].versions[1].incorporation, 'pending');
});

test('binary extraction remains explicit and source tampering fails', t => {
  const root = workspace(t); createProject(root, 'idea', { description: 'A game' });
  const source = path.join(root, 'spec.pdf'); fs.writeFileSync(source, Buffer.from([0, 255, 10, 7]));
  const result = ingest(root, 'idea', source, 'pdf', 'requirements');
  assert.equal(result.extraction, 'required');
  fs.appendFileSync(path.join(root, 'projects/idea', result.path!), 'changed');
  assert.match(validate(root).join(' '), /hash mismatch/);
});

test('same wiki page names in separate projects are valid; broken links fail', t => {
  const root = workspace(t);
  for (const id of ['one', 'two']) { createProject(root, id, { description: id }); write(path.join(root, `projects/${id}/wiki/offer.md`), '# Offer\n'); }
  assert.deepEqual(validate(root), []);
  write(path.join(root, 'projects/one/wiki/offer.md'), '[Missing](missing.md)\n');
  assert.match(validate(root).join(' '), /Broken link/);
});

test('assessed state cannot pass with an uninitialised ontology or missing evidence', t => {
  const root = workspace(t); createProject(root, 'idea', { description: 'A service' });
  const file = path.join(root, 'projects/idea/project.md'), p = block(file);
  p.state = 'assessed'; p.assessment = { revision: 'a001', date: '2026-10-08' }; p.recommendation = 'service'; setBlock(file, p);
  assert.match(validate(root).join(' '), /ontology/);
  write(path.join(root, 'projects/idea/wiki/ontology.md'), '# Ontology\nAudience -> Offer\n');
  assert.match(validate(root).join(' '), /review/);
});

test('changed recommendation does not substitute selected financial figures', t => {
  const root = workspace(t); createProject(root, 'idea', { description: 'A service' });
  const file = path.join(root, 'projects/idea/project.md'), p = block(file);
  p.selected = { option: 'service', assessment: 'a001', decision: 'd001' }; p.assessment = { revision: 'a002', date: '2026-10-08' }; p.recommendation = 'package'; setBlock(file, p);
  writeJSON(path.join(root, 'projects/idea/finance/service.results.json'), { option: 'service', assessment: 'a002', currency: 'GBP', results: [{ scenario: 'central', horizonDays: 365, peakFunding: 12345, ownerHours: 999 }] });
  const index = indexText(root); assert.ok(index.includes('service @ a001')); assert.ok(index.includes('package')); assert.ok(!index.includes('12345'));
});

test('package finance matches conditional sale and no-sale calculations', () => {
  const costs = [event(0, 0, 'cost', 1600), ...Array.from({ length: 6 }, (_, i) => event((i + 1) * 30, 0, 'cost', 10)), event(180, 1, 'sale', 12000), event(180, 2, 'cost', 1200)];
  const result = calculate(model(costs)).results[0];
  assert.equal(result.cashAfterCosts, 9140); assert.equal(result.ownerResult, 5140); assert.equal(result.peakFunding, 1660); assert.equal(result.firstCashDay, 180);
  const unsold = calculate(model([event(0, 0, 'cost', 1600), ...Array.from({ length: 36 }, (_, i) => event((i + 1) * 30, 0, 'cost', 10))])).results[1];
  assert.equal(unsold.cashAfterCosts, -1960); assert.equal(unsold.ownerResult, -5960);
});

test('unknown inputs propagate without invented zeroes', () => {
  const result = calculate(model([event(0, 0, 'cost', null)])).results[0];
  assert.equal(result.cashAfterCosts, null); assert.equal(result.peakFunding, null); assert.equal(result.ownerResult, null);
  assert.equal(calculate(model([], { hourlyValue: null })).results[0].ownerResult, null);
});

test('owner pay is charged once and financing does not hide funding needs', () => {
  const result = calculate(model([event(0, 0, 'financing', 10000), event(0, 1, 'cost', 1000), event(1, 0, 'receipt', 5000), event(1, 1, 'owner-pay', 1000)])).results[0];
  assert.equal(result.cashAfterCosts, 3000); assert.equal(result.cashBeforeOwnerPay, 4000); assert.equal(result.ownerResult, 0); assert.equal(result.peakFunding, 1000);
});

test('owner ledger and cash transferred prevent sale double counting', () => {
  const m = model([event(1, 0, 'receipt', 2000), event(2, 0, 'sale', 10000), event(2, 1, 'cash-transferred', 2000)]);
  assert.equal(calculate(m).results[0].cashAfterCosts, 10000);
  m.ownership = 'owner-ledger';
  (m.scenarios[0] as any).ownerLedger = [{ day: 0, direction: 'out', amount: 1000, basis: 'Owner investment' }, { day: 2, direction: 'in', amount: 3000, basis: 'Actual distributions' }];
  assert.equal(calculate(m).results[0].ownerResult, -2000);
});

test('invalid amounts and ambiguous timing are rejected', () => {
  assert.throws(() => calculate(model([event(0, 0, 'cost', -1)])));
  assert.throws(() => calculate(model([event(0, 0, 'cost', 1), event(0, 0, 'receipt', 1)])));
});

test('domain results separate premium, resale, availability and ownership', () => {
  const t = '2026-10-08T12:00:00Z';
  const standard = interpret('example.com', { results: [{ domainName: 'example.com', purchasable: true, purchaseType: 'registration', purchasePrice: 10, renewalPrice: 12, premium: false }] }, t);
  assert.equal(standard.status, 'available'); assert.equal(standard.ownership, 'unknown');
  const premium = interpret('example.com', { results: [{ domainName: 'example.com', purchasable: true, purchaseType: 'registration', premium: true, purchasePrice: 1000 }] }, t);
  assert.equal(premium.premium, true); assert.equal(premium.renewalCost, null);
  const resale = interpret('example.com', { results: [{ domainName: 'example.com', purchasable: true, purchaseType: 'aftermarket', purchasePrice: 5000 }] }, t);
  assert.equal(resale.status, 'unknown'); assert.equal(resale.resale?.askingPrice, 5000);
  assert.equal(interpret('example.com', { results: [{ domainName: 'example.com', purchasable: false }] }, t).status, 'unavailable');
  assert.equal(interpret('example.com', { results: [{ domainName: 'example.com' }, { domainName: 'example.com', purchasable: true }] }, t).status, 'unknown');
  assert.equal(interpret('example.com', {}, t).status, 'unknown');
});

test('domain transport preserves failure as unknown and never purchases', async () => {
  let calls = 0;
  const f: any = async (url: string, args: any) => { calls++; assert.equal(url, 'https://api.name.com/core/v1/domains:checkAvailability'); assert.equal(args.redirect, 'error'); return { ok: true, json: async () => ({ results: [{ domainName: 'example.com', purchasable: true, purchaseType: 'registration' }] }) }; };
  assert.equal((await checkDomain('example.com', {}, f)).result.status, 'unknown'); assert.equal(calls, 0);
  assert.equal((await checkDomain('example.com', { NAMECOM_USERNAME: 'test', NAMECOM_TOKEN: 'fake' }, f)).result.status, 'available'); assert.equal(calls, 1);
  assert.equal((await checkDomain('example.com', { NAMECOM_USERNAME: 'test', NAMECOM_TOKEN: 'fake' }, (async () => { throw Error('timeout'); }) as any)).result.status, 'unknown');
});

test('international domains are retained as exact ASCII names', () => {
  assert.equal(normaliseDomain('café.example'), 'xn--caf-dma.example');
  assert.throws(() => normaliseDomain('https://example.com/path'));
});

test('bootstrap creates model-specific workspaces and resumes without overwriting', t => {
  const root = workspace(t), targetBase = fs.mkdtempSync(path.join(os.tmpdir(), 'ozeylab-targets-'));
  t.after(() => fs.rmSync(targetBase, { recursive: true, force: true }));
  createProject(root, 'idea', { description: 'Example project' });
  const file = path.join(root, 'projects/idea/project.md'), p = block(file);
  assert.throws(() => bootstrap(root, 'idea', path.join(targetBase, 'before'), 'services', 'a'.repeat(40)));
  p.state = 'selected'; p.assessment = { revision: 'a001' }; p.selected = { option: 'service', assessment: 'a001', decision: 'd001' }; setBlock(file, p);
  const accepted = fixtureCommit(root);
  assert.throws(() => bootstrap(root, 'idea', path.join(targetBase, 'fake'), 'services', 'a'.repeat(40)), /Accepted commit/);
  for (const profile of ['assets', 'services', 'software', 'information', 'matching', 'goods']) {
    const target = path.join(targetBase, profile); bootstrap(root, 'idea', target, profile, accepted);
    assert.ok(fs.existsSync(path.join(target, 'docs/commercial-launch-spec.md')));
    write(path.join(target, 'README.md'), 'Owner edits\n');
    assert.equal(bootstrap(root, 'idea', target, profile, accepted).status, 'existing-scaffold');
    assert.equal(read(path.join(target, 'README.md')), 'Owner edits\n');
  }
  assert.ok(fs.existsSync(path.join(targetBase, 'software/docs/development-spec.md')));
  assert.ok(fs.existsSync(path.join(targetBase, 'services/operations/service.md')));
  p.objective = 'noncommercial'; setBlock(file, p); const noncommercialCommit = fixtureCommit(root); bootstrap(root, 'idea', path.join(targetBase, 'noncommercial'), 'information', noncommercialCommit);
  assert.ok(fs.existsSync(path.join(targetBase, 'noncommercial/docs/launch-spec.md')));
  assert.equal(block(file).state, 'selected');
  assert.throws(() => bootstrap(root, 'idea', root, 'software', 'a'.repeat(40)));
});

test('due queue excludes paused and closed projects', t => {
  const root = workspace(t);
  for (const id of ['due', 'paused', 'closed', 'future']) {
    createProject(root, id, { description: id }); const file = path.join(root, `projects/${id}/project.md`), p = block(file);
    p.review.nextDate = id === 'future' ? '2027-01-01' : '2026-10-01'; p.paused = id === 'paused'; if (id === 'closed') p.state = 'closed'; setBlock(file, p);
  }
  assert.deepEqual(dueProjects(root, '2026-10-08').map(x => x.id), ['due']);
});

test('tool skill copies retain canonical process dependencies', t => {
  const root = workspace(t);
  for (const tool of ['claude-code', 'cursor', 'codex']) {
    const destination = installSkills(root, tool);
    assert.equal(read(path.join(root, destination, 'project-query/SKILL.md')), read(path.join(root, 'skills/project-query/SKILL.md')));
  }
});
