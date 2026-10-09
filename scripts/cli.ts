import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { block, setBlock, read, json, write, writeJSON, slug, projectPath, lock } from './core.ts';
import { createProject, ingest, withdraw, indexText, installSkills, dueProjects } from './projects.ts';
import { calculate } from './finance.ts';
import { validate } from './validate.ts';
import { bootstrap } from './bootstrap.ts';
import { checkDomain, normaliseDomain } from './domain.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), command = args.shift();
const out = (x: unknown) => console.log(typeof x === 'string' ? x : JSON.stringify(x, null, 2));
function options(tokens: string[]) {
  const found: Record<string, string[]> = {};
  for (let i = 0; i < tokens.length; i += 2) {
    if (!tokens[i].startsWith('--') || !tokens[i + 1] || tokens[i + 1].startsWith('--')) throw new Error('Options need a value.');
    (found[tokens[i].slice(2)] ??= []).push(tokens[i + 1]);
  }
  return found;
}
try {
  switch (command) {
    case 'create': {
      const id = args.shift()!, o = options(args);
      if (Object.keys(o).some(k => !['description', 'domain', 'spec'].includes(k))) throw new Error('Unknown create option.');
      out(lock(root, () => createProject(root, id, { description: o.description?.[0], domain: o.domain?.[0], specs: o.spec }))); break;
    }
    case 'ingest': {
      const [id, filename, sourceId, subject, ...rest] = args, o = options(rest);
      out(lock(root, () => ingest(root, id, filename, sourceId, subject, o.extract?.[0]))); break;
    }
    case 'withdraw': out(lock(root, () => withdraw(root, args[0], args[1], args[2]))); break;
    case 'archive': {
      const dir = projectPath(root, args[0]), p = block(path.join(dir, 'project.md'));
      if (!p.assessment?.revision) throw new Error('No assessment to archive.');
      const target = path.join(dir, 'assessments', slug(p.assessment.revision));
      out(lock(root, () => {
        if (fs.existsSync(target)) throw new Error('Assessment archive already exists; inspect before editing.');
        fs.mkdirSync(target, { recursive: true });
        for (const name of ['project.md', 'case-study.md', 'naming.md', 'finance']) if (fs.existsSync(path.join(dir, name))) fs.cpSync(path.join(dir, name), path.join(target, name), { recursive: true });
        return target;
      })); break;
    }
    case 'finance': {
      const dir = path.join(projectPath(root, args[0]), 'finance');
      out(lock(root, () => fs.readdirSync(dir).filter(f => f.endsWith('.model.json')).map(f => { const result = calculate(json(path.join(dir, f))); writeJSON(path.join(dir, f.replace('.model.json', '.results.json')), result); return result; }))); break;
    }
    case 'index': {
      const content = indexText(root), file = path.join(root, 'projects/index.md');
      if (args.includes('--check')) { if (!fs.existsSync(file) || read(file) !== content) throw new Error('Portfolio index is stale. Run npm run index.'); out('Index matches project records.'); }
      else { lock(root, () => write(file, content)); out('Portfolio index generated.'); } break;
    }
    case 'validate': {
      const errors = validate(root, args[0]);
      if (errors.length) throw new Error(errors.join('\n'));
      out('Structural and calculation checks passed. Semantic review is separate.'); break;
    }
    case 'due': out(dueProjects(root, args[0])); break;
    case 'install-skills': out(lock(root, () => installSkills(root, args[0]))); break;
    case 'bootstrap': out(lock(root, () => bootstrap(root, args[0], args[1], args[2], args[3]))); break;
    case 'domain-check': {
      const dir = projectPath(root, args[0]), ascii = normaliseDomain(args[1]);
      block(path.join(dir, 'project.md'));
      const evidence = await checkDomain(args[1]);
      const suffix = evidence.result.checkedAt.replaceAll(':', '-');
      const relative = `sources/domains/${ascii}/${suffix}.json`;
      lock(root, () => {
        writeJSON(path.join(dir, relative), evidence);
        ingest(root, args[0], path.join(dir, relative), 'domain-' + ascii.replaceAll('.', '-'), 'domains');
        write(path.join(dir, 'naming.md'), read(path.join(dir, 'naming.md')) + `\n- ${evidence.result.checkedAt}: ${ascii}: ${evidence.result.status}. [Evidence](${relative}).\n`);
      });
      out(evidence.result); break;
    }
    case 'help': case undefined:
      out('Commands: create, ingest, withdraw, archive, finance, index [--check], validate [ID], due [YYYY-MM-DD], install-skills, bootstrap, domain-check. See docs/usage.md.'); break;
    default: throw new Error('Unknown command. See docs/usage.md.');
  }
} catch (error: any) { console.error(error.message); process.exitCode = 1; }
