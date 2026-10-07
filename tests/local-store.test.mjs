import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { store, read, list, search, deleteAuthorized } from '../skills/woia-documents/scripts/local-store.mjs';

test('explicit local backend persists exact bytes, stable IDs and immutable versions', async () => {
 const root = await mkdtemp(path.join(tmpdir(), 'woia-documents-test-'));
 try {
  const bytes=Buffer.from('public synthetic evidence');
  const context={org_id:'synthetic-org',allowed_document_ids:['synthetic-doc'],approved_store_root:root};
  const v={org_id:context.org_id,document_id:'synthetic-doc',version_id:'1',native_id:'local-native',native_version:'1',source_ref:'synthetic-source',checksum:createHash('sha256').update(bytes).digest('hex'),business_links:['Lease:synthetic']};
  await store(root,v,bytes,context);
  assert.deepEqual((await read(root,v.document_id,'1',context)).bytes,bytes);
  await assert.rejects(store(root,v,bytes,context),{code:'EEXIST'});
  assert.equal((await list(root,context)).length,1);
  assert.equal((await search(root,'Lease',context)).length,1);
  await assert.rejects(read(root,v.document_id,'1',{...context,allowed_document_ids:[]}));
  assert.equal((await list(root,{...context,org_id:'different-org'})).length,0);
  await assert.rejects(store(root,{...v,version_id:'2'},bytes,{...context,approved_store_root:'unapproved'}));
  await assert.rejects(deleteAuthorized(root,v.document_id,'1',{...context,hold:true}));
  await deleteAuthorized(root,v.document_id,'1',{...context,disposal_approved:true,approval_document_id:v.document_id,approval_checksum:v.checksum,approval_document_version:'1',retention_resolved:true,retention_expired:true,hold:false});
  assert.equal((await list(root,context)).length,0);
 } finally { await rm(root,{recursive:true,force:true}); }
});
