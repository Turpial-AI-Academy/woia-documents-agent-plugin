# woia-documents

Version 0.5.6. Durable document identity, verified bytes and version lineage under access, hold and retention controls.

Portable entry: [Agent Skill](skills/woia-documents/SKILL.md). Source contracts derive from Real Estate `eb0a7278188b2f9968e21ed4299f08184d864cac`.

Run `mise run bootstrap`, `mise run doctor`, `pnpm test`, `pnpm run ci:fast`. Central certification: Ecosystem v0.5.6 `mise run plugin:certify-thin --repo <absolute-path>`.

Local helpers operate only on provided data. No backend, DBMS, external adapter, authority policy, fees, account or legal applicability is selected. Adapter qualification and Operator E2E remain NOT_RUN; no Production Ready claim.

An explicitly bound local backing-store helper stores/reads/lists/searches immutable versioned bytes and performs exact approved disposal. Synthetic regression verifies byte integrity, organization isolation, permission denial, exclusive duplicate protection and hold/retention gates. Only a caller-authenticated private context may bind a root; external file/calendar/signature adapters remain unqualified. Local filesystem crash recovery, hostile shared storage and production backup qualification remain NOT_RUN.

## Maintenance

Edit only this canonical repository. Keep `plugin.json`, `package.json` and `dev.woia/manifest.json` versions aligned. From the canonical WOIA Ecosystem repository, run `mise run plugin:certify-thin --repo <absolute-plugin-repository>`, then use its release preparation/publication tasks. Install and update consumers from immutable published artifacts; keep Project personalization in overlays.
