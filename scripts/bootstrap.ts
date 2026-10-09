import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { block, json, write, writeJSON, read, hash, projectPath, slug } from './core.ts';

export function bootstrap(root: string, id: string, target: string, profile: string, acceptedCommit: string) {
  const dir = projectPath(root, id), p = block(path.join(dir, 'project.md'));
  if (!['selected', 'bootstrapped'].includes(p.state) || !p.selected) throw new Error('An explicit selected route is required.');
  if (!/^[a-f0-9]{40}$/.test(acceptedCommit)) throw new Error('Supply the exact accepted central commit.');
  if (p.selected.assessment !== p.assessment?.revision) throw new Error('Selection is not the current assessment. Use a checkout of the selected assessment.');
  for (const file of ['project.md', 'case-study.md', 'decisions.md']) {
    const revision = spawnSync('git', ['show', `${acceptedCommit}:projects/${id}/${file}`], { cwd: root, encoding: 'utf8' });
    if (revision.status !== 0 || revision.stdout !== read(path.join(dir, file))) throw new Error(`Accepted commit is missing or does not match ${file}. Use the exact accepted checkout.`);
  }
  const spec = json(path.join(root, 'templates/bootstrap', slug(profile) + '.json'));
  const destination = path.resolve(target), rootPath = path.resolve(root);
  if (destination === rootPath || rootPath.startsWith(destination + path.sep) || destination.startsWith(rootPath + path.sep)) throw new Error('Use a target outside the central repository.');
  const manifestPath = path.join(destination, '.ozeylab-bootstrap.json');
  const basis = { project: p.id, selected: p.selected, profile, acceptedCommit, caseHash: hash(read(path.join(dir, 'case-study.md'))) };
  if (fs.existsSync(destination)) {
    if (!fs.existsSync(manifestPath)) throw new Error('Target exists without a matching bootstrap manifest.');
    const old = json(manifestPath);
    if (JSON.stringify(old.basis) !== JSON.stringify(basis)) throw new Error('Target belongs to a different bootstrap basis.');
    if (!old.files.every((f: string) => fs.existsSync(path.join(destination, f)))) throw new Error('Incomplete scaffold. Restore missing files from the recorded basis before resuming.');
    return { target: destination, status: 'existing-scaffold', overwrite: false };
  }
  const launch = p.objective === 'noncommercial' ? 'launch-spec.md' : 'commercial-launch-spec.md';
  const content: Record<string, string> = {
    'README.md': `# ${p.name}\n\n${p.description ?? 'Selected ozeylab project.'}\n\nStatus: initial workspace; bootstrap stages remain to be executed.\n\nRead [the bootstrap plan](docs/research-logs/bootstrap.md), [operating model](docs/operating-model-spec.md) and [launch specification](docs/${launch}).\n`,
    'AGENTS.md': '# Working rules\n\nRead the bootstrap plan and specifications. Preserve the accepted case snapshot as history. Record checks before claiming completion. Current execution specifications belong here. Use the central case for comparative decisions. Follow the commit and verification rules in the bootstrap plan.\n',
    'docs/case-study-snapshot.md': '# Historical accepted case snapshot\n\nCentral record: projects/' + id + '/case-study.md\nAccepted commit: ' + acceptedCommit + '\nAssessment: ' + p.selected.assessment + '\nSelected option: ' + p.selected.option + '\n\n' + read(path.join(dir, 'case-study.md')),
    'docs/operating-model-spec.md': `# Operating model\n\nSelected profile: ${spec.title}\nOption: ${p.selected.option}\nAssessment: ${p.selected.assessment}\n\n## Outcome and payer\n\nResolve from the selected case.\n\n## Delivery\n\nDefine responsibilities, steps, capacity, quality, exceptions and handover.\n\n## Starting contents\n\n${spec.requiredContents}\n\n## Verification\n\n${spec.acceptance}\n`,
    [`docs/${launch}`]: '# Launch specification\n\nStatus: planned. Populate from the selected case.\n\n## First outcome\n\nDefine the recipient, deliverable and acceptance evidence.\n\n## Work and funding\n\n| Milestone | Owner | Dependencies | Cash | Hours | Timing | Exit evidence |\n| --- | --- | --- | --- | --- | --- | --- |\n\nLink dated finance assumptions. Separate setup, later development and operations.\nRecord funding timing, obligations and domain acquisition dependencies.\n\n## Decision thresholds\n\nDefine continue, change, sell, pause and stop conditions.\n',
    'docs/research-logs/bootstrap.md': `# Project bootstrap\n\nStatus: planned. Scaffold generation does not complete these stages.\n\nBasis: ${acceptedCommit}; ${p.selected.assessment}; ${p.selected.option}.\n\n1. Resolve scope, names, domain evidence and acquisition dependencies.\n2. Research and choose the foundation and relevant skills.\n3. Populate the operating model, launch specification and starting deliverables.\n4. Verify: ${spec.acceptance}\n5. Push the authorised GitHub target and read back its exact commit.\n\nFor each stage record inputs, work, outputs, dependencies, budget and exit criteria.\nRecord commands, actual results, failures, run/model information and next work unit.\n\nBefore committing inspect repository history and guidance, run required verification,\nand use feature/fix/docs/chore with an imperative summary. End each AI commit with\none Co-Authored-By trailer naming the verified model and provider noreply address.\n\n## Handover\n\nCentral project: ${id}\nCentral case: projects/${id}/case-study.md\nCentral accepted commit: ${acceptedCommit}\nTarget GitHub URL and commit: not yet verified.\n`,
    ...spec.files
  };
  // Stage in a sibling directory so interrupted generation cannot leave a half-scaffold.
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const temp = fs.mkdtempSync(destination + '.tmp-');
  try {
    for (const [name, text] of Object.entries(content)) write(path.join(temp, name), text);
    writeJSON(path.join(temp, '.ozeylab-bootstrap.json'), { basis, status: 'planned', files: Object.keys(content) });
    fs.renameSync(temp, destination);
  } catch (error) { fs.rmSync(temp, { recursive: true, force: true }); throw error; }
  return { target: destination, status: 'scaffold-created', files: Object.keys(content), completion: 'Bootstrap execution and GitHub verification remain required.' };
}
