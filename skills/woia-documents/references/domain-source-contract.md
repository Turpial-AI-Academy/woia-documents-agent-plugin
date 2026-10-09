# Accepted focused source contract


## 9. Document and logical file contract

### Document lifecycle

Document and DocumentVersion are canonical metadata; bytes remain in a qualified backend.

Version states must distinguish at least:
- STAGED / bytes not yet verified;
- USABLE / exact expected bytes/version accessible under current policy;
- MISSING_OR_CORRUPT;
- ARCHIVED;
- DISPOSED metadata marker where policy permits retaining minimal disposal evidence.

The actual names may vary in implementation, but the distinctions may not collapse.

### Typed links

Canonical business links use typed FK-capable relations from the catalog. A generic unchecked `target_type + target_id` may exist only as a non-authoritative projection/index; it may not be the sole integrity mechanism.

### Logical file placement

Logical folder/path is a view over Document identity. Recommended projection namespaces include Property, Lease, Person/Organization, Mandate, Settlement, Maintenance and general organization material, but the exact human folder presentation is organization/UI configuration.

Move/rename changes FilePlacement/provider path, not Document identity, business links or truth.

### Retention/access

Legal/competent policy determines classification, hold and disposal. The backing provider, cache, extraction/index and export must enforce the same applicable restrictions. A backup or copied file does not create broader access.
