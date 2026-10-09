import fs from 'node:fs';
import path from 'node:path';
import { block, setBlock, read, write, writeJSON, hash, slug, projectPath, projectDirs, files } from './core.ts';
import { normaliseDomain } from './domain.ts';

export function createProject(root: string, id: string, input: { description?: string, domain?: string, specs?: string[] }) {
  slug(id);
  if (!input.description && !input.domain && !input.specs?.length) throw new Error('Supply a description, domain or spec.');
  if (input.domain) normaliseDomain(input.domain);
  for (const spec of input.specs ?? []) if (!fs.statSync(spec).isFile()) throw new Error('Specifications must be files.');
  const target = projectPath(root, id);
  if (fs.existsSync(target)) throw new Error('Project already exists. Ingest into its existing record.');
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(path.join(root, 'templates/project'), target, { recursive: true });
  const p = block(path.join(target, 'project.md'));
  Object.assign(p, { id, name: id, description: input.description ?? null, domains: input.domain ? [{ name: normaliseDomain(input.domain), ownership: 'reported-unconfirmed', accepted: false }] : [] });
  setBlock(path.join(target, 'project.md'), p);
  if (input.description) {
    const note = path.join(target, 'sources/input/description.md');
    write(note, '# Supplied description\n\n' + input.description + '\n');
    ingest(root, id, note, 'description', 'description');
  }
  if (input.domain) {
    const note = path.join(target, 'sources/input/domain.md');
    write(note, '# Supplied domain\n\n' + input.domain + '\n\nOwnership and availability are not verified.\n');
    ingest(root, id, note, 'domain', 'identity');
  }
  (input.specs ?? []).forEach((file, i) => ingest(root, id, file, `spec-${i + 1}`, 'specifications'));
  return target;
}

export function ingest(root: string, id: string, filename: string, sourceId: string, subject: string, extract?: string) {
  slug(sourceId); slug(subject);
  const dir = projectPath(root, id), registryFile = path.join(dir, '.wiki/source-registry.md');
  const registry = block(registryFile);
  const stat = fs.lstatSync(filename);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Supply a regular file.');
  const bytes = fs.readFileSync(filename), digest = hash(bytes);
  let source = registry.sources.find((s: any) => s.id === sourceId);
  const previous = source?.versions.at(-1);
  if (previous?.sha256 === digest && previous.status === 'current') return { changed: false, sourceId };
  const ext = path.extname(filename).toLowerCase();
  const relative = `sources/${subject}/${sourceId}/${digest.slice(0, 16)}${ext || '.bin'}`;
  const readable = ['.md', '.txt', '.csv', '.json', '.yaml', '.yml', '.ts', '.js'].includes(ext);
  if (!source) { source = { id: sourceId, origin: path.basename(filename), versions: [] }; registry.sources.push(source); }
  if (previous?.status === 'current') previous.status = 'superseded';
  fs.mkdirSync(path.dirname(path.join(dir, relative)), { recursive: true });
  fs.writeFileSync(path.join(dir, relative), bytes);
  const version: any = { sha256: digest, path: relative, examinedAt: new Date().toISOString(), status: 'current', incorporation: 'pending', extraction: readable ? 'native-text' : 'required', extract: null, limitations: readable ? [] : ['Binary source needs a checked readable extract.'], affectedPages: [], run: null };
  if (extract) {
    version.extract = `sources/${subject}/${sourceId}/${digest.slice(0, 16)}-extract.md`;
    fs.copyFileSync(extract, path.join(dir, version.extract));
    version.extraction = 'supplied-extract'; version.limitations = ['Check extract against original before incorporating.'];
  }
  source.versions.push(version);
  setBlock(registryFile, registry);
  return { changed: true, sourceId, sha256: digest, path: relative, extraction: version.extraction };
}

export function withdraw(root: string, id: string, sourceId: string, reason: string) {
  if (!reason) throw new Error('Withdrawal needs a reason.');
  const file = path.join(projectPath(root, id), '.wiki/source-registry.md'), registry = block(file);
  const version = registry.sources.find((s: any) => s.id === sourceId)?.versions.at(-1);
  if (!version) throw new Error('Unknown source.');
  version.status = 'withdrawn'; version.incorporation = 'pending'; version.withdrawalReason = reason;
  setBlock(file, registry);
}

const cell = (value: any) => String(value ?? 'unknown').replaceAll('|', '\\|').replaceAll('\n', ' ');
export function indexText(root: string) {
  const rows = projectDirs(root).map(dir => {
    const p = block(path.join(dir, 'project.md'));
    let money: any = null;
    if (p.selected && p.assessment?.revision === p.selected.assessment) {
      const modelFile = path.join(dir, 'finance', `${slug(p.selected.option)}.results.json`);
      if (fs.existsSync(modelFile)) {
        const m = JSON.parse(read(modelFile));
        if (m.option === p.selected.option && m.assessment === p.selected.assessment) money = { currency: m.currency, result: m.results.find((x: any) => x.scenario === 'central' && x.horizonDays === 365) };
      }
    }
    return `| [${cell(p.name)}](${p.id}/project.md) | ${cell(p.state)}${p.paused ? ' (paused)' : ''} | ${cell(p.selected?.option)} @ ${cell(p.selected?.assessment)} | ${cell(p.recommendation)} | ${money?.result ? cell(money.result.peakFunding) + ' ' + cell(money.currency) : 'unknown'} | ${cell(money?.result?.ownerHours)} | ${cell(p.assessment?.date)} | ${cell(p.uncertainty)} | ${cell(p.nextAction)} |`;
  });
  return '# Projects\n\nGenerated from project records. Financial columns use the selected option at its selected assessment, central scenario, 365 days. Missing current forecasts stay unknown. No portfolio cash totals are inferred.\n\n| Project | State | Selected option / assessment | Recommendation | Peak cash required | Owner hours | Assessed | Main uncertainty | Next action |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n' + rows.join('\n') + '\n';
}

export function dueProjects(root: string, today = new Date().toISOString().slice(0, 10)) {
  return projectDirs(root).map(d => block(path.join(d, 'project.md'))).filter(p => !p.paused && p.state !== 'closed' && p.review.nextDate && p.review.nextDate <= today).map(p => ({ id: p.id, scope: p.review.scope, budget: p.review.budget, nextDate: p.review.nextDate }));
}

export function installSkills(root: string, tool: string) {
  const bases: Record<string, string> = { 'claude-code': '.claude/skills', cursor: '.cursor/skills', codex: '.agents/skills' };
  if (!bases[tool]) throw new Error('Choose claude-code, cursor or codex.');
  for (const file of files(path.join(root, 'skills'))) {
    const target = path.join(root, bases[tool], path.relative(path.join(root, 'skills'), file));
    write(target, read(file));
  }
  return bases[tool];
}
