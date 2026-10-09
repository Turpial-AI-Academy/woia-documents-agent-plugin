# Accepted focused source contract


### 5.4 `woia-documents` — NEW_REQUIRED

**Actions:**
- artifact: `document.store`, `read`, `list`, `search`, `move`, `version`, `archive`, `delete-authorized`
- transform: `document.generate`, `document.extract`, `document.compare`
- signature: `signature.request`, `signature.status.observe`, `signature.effect.reconcile`

**Consumers:** all departments under field/document scope.

**Guards:** stable Document/native IDs, checksum/version/provenance/business links, retention/hold/access; extraction never becomes accepted fact automatically. Store/read/list/search/version/generate/extract/compare are scoped by the caller's document/field authority. `signature.request` requires the competent business/Legal signing workflow and exact document/signatory authority. `document.delete-authorized` requires the accepted retention/hold/disposal decision and cannot be inferred from ordinary write access. Signature result is distinct from legal validity. External signature notifications obey the Customer Service-only rule.

**Backends:** provider-agnostic. Initial publication needs at least one fully qualified file backend; additional advertised backends require their own qualification.
