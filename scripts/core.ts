import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const states = ['captured', 'assessed', 'selected', 'bootstrapped', 'closed'];
export const families = ['assets', 'services', 'software', 'information', 'matching', 'goods'];
export const slug = (value: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new Error('Use a lowercase ID with letters, digits and hyphens.');
  return value;
};
export const hash = (value: string | Buffer) => crypto.createHash('sha256').update(value).digest('hex');
export const read = (file: string) => fs.readFileSync(file, 'utf8');
export const json = (file: string) => JSON.parse(read(file));
export function write(file: string, value: string) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, value);
  fs.renameSync(temp, file);
}
export const writeJSON = (file: string, value: unknown) => write(file, JSON.stringify(value, null, 2) + '\n');
export function block(file: string) {
  const m = read(file).match(/```json\n([\s\S]*?)\n```/);
  if (!m) throw new Error(`Missing JSON record: ${file}`);
  return JSON.parse(m[1]);
}
export function setBlock(file: string, data: unknown) {
  write(file, read(file).replace(/```json\n[\s\S]*?\n```/, '```json\n' + JSON.stringify(data, null, 2) + '\n```'));
}
export const projectPath = (root: string, id: string) => path.join(root, 'projects', slug(id));
export function projectDirs(root: string) {
  const dir = path.join(root, 'projects');
  return fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory() && fs.existsSync(path.join(dir, d.name, 'project.md'))).map(d => path.join(dir, d.name)).sort() : [];
}
export function contained(root: string, relative: string) {
  const target = path.resolve(root, relative);
  if (!target.startsWith(path.resolve(root) + path.sep)) throw new Error('Path escapes its project.');
  return target;
}
export function files(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    if (d.isSymbolicLink()) throw new Error(`Symbolic links are not supported: ${d.name}`);
    return d.isDirectory() ? files(path.join(dir, d.name)) : [path.join(dir, d.name)];
  });
}
export function lock(root: string, operation: () => unknown) {
  const file = path.join(root, '.ozeylab-lock');
  const fd = fs.openSync(file, 'wx');
  try { return operation(); } finally { fs.closeSync(fd); fs.unlinkSync(file); }
}
