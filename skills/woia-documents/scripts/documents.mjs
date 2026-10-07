import { createHash } from 'node:crypto';
const fail=(c,m)=>{if(!c)throw new Error(m)};
export function verifiedVersion(input,bytes,context){
 fail(input.org_id===context.org_id&&context.allowed_document_ids?.includes(input.document_id),'DOCUMENT_ACCESS_DENIED');
 fail(input.document_id&&input.version_id&&input.native_id&&input.native_version&&input.source_ref,'DOCUMENT_PROVENANCE_REQUIRED');
 fail(Array.isArray(input.business_links)&&input.business_links.length>0,'BUSINESS_LINK_REQUIRED');
 const checksum=createHash('sha256').update(bytes).digest('hex');
 fail(input.checksum===checksum,'CHECKSUM_MISMATCH');
 return {...structuredClone(input),checksum,status:'USABLE'};
}
export function appendVersion(versions,input,bytes,context){
 const next=verifiedVersion(input,bytes,context);
 fail(!versions.some(v=>v.org_id===next.org_id&&v.document_id===next.document_id&&v.version_id===next.version_id),'DUPLICATE_VERSION');
 return [...structuredClone(versions),next];
}
export function moveProjection(version,path,context){
 fail(version.org_id===context.org_id&&context.allowed_document_ids?.includes(version.document_id),'DOCUMENT_ACCESS_DENIED');
 fail(typeof path==='string'&&path.length>0,'PATH_REQUIRED');
 return {...structuredClone(version),logical_path:path};
}
export function disposalDecision(version,context){
 fail(version.org_id===context.org_id&&context.allowed_document_ids?.includes(version.document_id),'DOCUMENT_ACCESS_DENIED');
 fail(context.disposal_approved===true&&context.approval_document_id===version.document_id&&context.approval_checksum===version.checksum&&context.approval_document_version===version.version_id&&context.retention_resolved===true&&context.retention_expired===true,'DISPOSAL_APPROVAL_REQUIRED');
 fail(context.hold===false,'HOLD_OR_UNKNOWN');
 return {document_id:version.document_id,version_id:version.version_id,result:'DISPOSAL_ELIGIBLE',external_effect_executed:false};
}
export function extraction(version,values){fail(version.status==='USABLE','VERSION_NOT_USABLE');return {document_id:version.document_id,version_id:version.version_id,checksum:version.checksum,values:structuredClone(values),kind:'EVIDENCE',accepted_fact:false}}
export function signatureRequest(version,context){
 fail(version.status==='USABLE'&&version.org_id===context.org_id,'VERSION_NOT_USABLE_OR_ORG_MISMATCH');
 fail(context.allowed_document_ids?.includes(version.document_id)&&context.signatory_id&&context.competent_workflow_approved===true&&context.approved_checksum===version.checksum&&context.operation_id,'SIGNATURE_AUTHORITY_REQUIRED');
 fail(context.external_notifications_disabled===true,'CUSTOMER_SERVICE_NOTIFICATION_REQUIRED');
 fail(context.previous_outcome!=='UNKNOWN','RECONCILE_BEFORE_RETRY');
 return {operation_id:context.operation_id,document_id:version.document_id,version_id:version.version_id,signatory_id:context.signatory_id,result:'LOCAL_INTENT_VALIDATED',legal_validity:'NOT_DETERMINED',executed:false};
}
export function observeSignature(request,status,source_ref){fail(source_ref&&['PENDING','SIGNED','REJECTED','UNKNOWN'].includes(status),'INVALID_SIGNATURE_OBSERVATION');return {...request,status,source_ref,legal_validity:'NOT_DETERMINED'}}
