import fs from 'node:fs';
import path from 'node:path';
import { block, json, read, hash, states, files, projectDirs, contained, slug } from './core.ts';
import { calculate } from './finance.ts';

export function validate(root: string, only?: string) {
  const errors: string[] = [];
  const dirs = only ? [path.join(root, 'projects', slug(only))] : projectDirs(root);
  for (const dir of dirs) {
    try {
      const p = block(path.join(dir, 'project.md'));
      if (p.id !== path.basename(dir) || !states.includes(p.state)) throw new Error('Invalid project ID or lifecycle state.');
      for (const file of ['case-study.md', 'naming.md', 'decisions.md', 'bootstrap.md', 'wiki/index.md', 'wiki/ontology.md', '.wiki/source-registry.md', '.wiki/maintenance-log.md']) if (!fs.existsSync(path.join(dir, file))) throw new Error(`Missing ${file}`);
      if (!p.name || !p.review || !Array.isArray(p.domains)) throw new Error('Incomplete project record.');
      const registry = block(path.join(dir, '.wiki/source-registry.md'));
      const ids = new Set();
      for (const s of registry.sources) {
        if (ids.has(s.id) || !s.versions.length) throw new Error('Duplicate source or empty history.');
        ids.add(s.id);
        if (s.versions.filter((v: any) => v.status === 'current').length > 1) throw new Error('Multiple current source versions.');
        for (const v of s.versions) {
          if (!['current', 'superseded', 'withdrawn'].includes(v.status) || !['pending', 'incorporated', 'excluded'].includes(v.incorporation)) throw new Error('Invalid source state.');
          if (hash(fs.readFileSync(contained(dir, v.path))) !== v.sha256) throw new Error(`Source hash mismatch: ${s.id}`);
          if (v.extract && !fs.existsSync(contained(dir, v.extract))) throw new Error('Missing source extract.');
          if (v.incorporation === 'incorporated' && (!v.run || v.extraction === 'required' || !v.affectedPages.length)) throw new Error('Incorporated source needs extraction, run and affected pages.');
          for (const page of v.affectedPages) if (!fs.existsSync(contained(dir, page))) throw new Error('Missing affected knowledge page.');
        }
      }
      const assessed = ['assessed', 'selected', 'bootstrapped'].includes(p.state);
      if (assessed) {
        if (!p.assessment?.revision || !p.assessment.date || !p.recommendation) throw new Error('Assessed state needs an assessment and recommendation.');
        const ontology = read(path.join(dir, 'wiki/ontology.md'));
        if (ontology.includes('UNINITIALISED')) throw new Error('Assessed state needs an initialised ontology.');
        if (!p.assessment.review || !fs.existsSync(contained(dir, p.assessment.review))) throw new Error('Assessment needs a review record.');
        const review = block(contained(dir, p.assessment.review));
        if (review.result !== 'pass' || review.assessment !== p.assessment.revision || !review.reviewer || !review.inputRevision) throw new Error('Review must pass for the exact assessment.');
        for (const s of registry.sources) if (s.versions.at(-1).incorporation === 'pending') throw new Error(`Assessment has pending source: ${s.id}`);
      }
      if (['selected', 'bootstrapped'].includes(p.state)) {
        if (!p.selected?.option || !p.selected?.assessment || !p.selected?.decision) throw new Error('Selection needs an option, assessment and decision.');
        if (!read(path.join(dir, 'decisions.md')).includes(p.selected.decision)) throw new Error('Selection decision missing.');
      }
      if (p.state === 'bootstrapped') {
        if (!/^https:\/\/github.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(p.target?.url ?? '') || !/^[a-f0-9]{40}$/.test(p.target?.bootstrapCommit ?? '') || typeof p.target?.verification !== 'string') throw new Error('Bootstrapped state needs a verified GitHub target and exact commit.');
        const evidence = block(contained(dir, p.target.verification));
        if (evidence.target !== p.target.url || evidence.commit !== p.target.bootstrapCommit || evidence.result !== 'pass' || !evidence.readBackAt || !evidence.method || !Array.isArray(evidence.checks) || !evidence.checks.length || evidence.checks.some((c: any) => c.result !== 'pass' || !c.output) || !evidence.nextWorkUnit) throw new Error('Incomplete bootstrap verification evidence.');
      }
      for (const file of files(path.join(dir, 'finance')).filter(f => f.endsWith('.model.json'))) {
        const model = json(file), results = calculate(model), output = file.replace('.model.json', '.results.json');
        if (p.assessment?.revision && model.assessment !== p.assessment.revision) throw new Error('Current finance model belongs to a different assessment.');
        if (!fs.existsSync(output) || JSON.stringify(json(output)) !== JSON.stringify(results)) throw new Error('Missing or stale financial results.');
      }
      // Relative links are scoped to this record; explicit ../ links can reference another project.
      for (const file of files(dir).filter(f => f.endsWith('.md') && !f.includes(`${path.sep}sources${path.sep}`))) {
        const content = read(file).replace(/```[\s\S]*?```/g, '');
        for (const match of content.matchAll(/\]\(([^\s)]+)\)/g)) {
          const link = match[1].split('#')[0];
          if (!link || /^[a-z][a-z0-9+.-]*:/i.test(link)) continue;
          if (!fs.existsSync(path.resolve(path.dirname(file), decodeURIComponent(link)))) throw new Error(`Broken link in ${path.relative(dir, file)}: ${link}`);
        }
      }
    } catch (error: any) { errors.push(`${path.basename(dir)}: ${error.message}`); }
  }
  for (const file of files(path.join(root, 'skills')).filter(f => f.endsWith('SKILL.md'))) {
    const content = read(file), name = path.basename(path.dirname(file));
    if (!content.startsWith(`---\nname: ${name}\ndescription: `) || !content.includes(`processes/${name}.md`)) errors.push(`Invalid skill or process link: ${name}`);
    if (!fs.existsSync(path.join(root, 'processes', `${name}.md`))) errors.push(`Missing process: ${name}`);
  }
  return errors;
}
