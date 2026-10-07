import { mkdir, readFile, writeFile, unlink, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { verifiedVersion, disposalDecision } from './documents.mjs';

// Explicit organization-selected local backing store, never an implicit universal backend.
function key(org, document, version) {
  return createHash('sha256').update(JSON.stringify([org, document, version])).digest('hex');
}
function scoped(root, context) {
  if (!path.isAbsolute(root) || root !== context.approved_store_root || !context.org_id) throw new Error('STORE_BINDING_REQUIRED');
  return path.join(root, createHash('sha256').update(context.org_id).digest('hex'));
}
export async function store(root, input, bytes, context) {
  const version = verifiedVersion(input, bytes, context);
  const dir = scoped(root, context);
  await mkdir(dir, { recursive: true });
  const stem = path.join(dir, key(version.org_id, version.document_id, version.version_id));
  // Bytes then immutable metadata publication. A failed metadata write never overwrites a published version.
  await writeFile(stem + '.bytes', bytes, { flag: 'wx' });
  try { await writeFile(stem + '.json', JSON.stringify(version), { flag: 'wx' }); }
  catch (error) { await unlink(stem + '.bytes'); throw error; }
  return version;
}
export async function read(root, document_id, version_id, context) {
  if (!context.allowed_document_ids?.includes(document_id)) throw new Error('DOCUMENT_ACCESS_DENIED');
  const stem = path.join(scoped(root, context), key(context.org_id, document_id, version_id));
  const metadata = JSON.parse(await readFile(stem + '.json', 'utf8'));
  const bytes = await readFile(stem + '.bytes');
  return { version: verifiedVersion(metadata, bytes, context), bytes };
}
export async function list(root, context) {
  const dir = scoped(root, context);
  const files = await readdir(dir).catch(error => { if (error.code === 'ENOENT') return []; throw error; });
  const result = [];
  for (const name of files.filter(n => n.endsWith('.json'))) {
    const v = JSON.parse(await readFile(path.join(dir, name), 'utf8'));
    if (v.org_id === context.org_id && context.allowed_document_ids?.includes(v.document_id)) result.push((await read(root, v.document_id, v.version_id, context)).version);
  }
  return result;
}
export async function search(root, query, context) {
  return (await list(root, context)).filter(v => v.document_id.includes(query) || v.business_links.some(link => link.includes(query)));
}
export async function deleteAuthorized(root, document_id, version_id, context) {
  const { version } = await read(root, document_id, version_id, context);
  disposalDecision(version, context);
  const stem = path.join(scoped(root, context), key(context.org_id, document_id, version_id));
  await unlink(stem + '.json');
  await unlink(stem + '.bytes');
  return { document_id, version_id, result: 'DELETED_LOCAL_BACKING_VERSION' };
}
