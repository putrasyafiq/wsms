# WSMS v2.11

Warehouse Space Management System with account-owned layouts, a visual warehouse login, floor and section editors, racks, reserved non-storage areas, capacity charts and Excel export.

## Run locally with SQLite

Requires Node.js 24 (Node 22.13+ with node:sqlite also works). No dependencies to install.

```sh
npm start
```

Open http://localhost:8080. Create an account using email and a password of at least 10 characters. Each warehouse has a separate document containing its floors, sections, racks and entrances. Users can own several warehouses or access warehouses shared with their account email. SQLite data defaults to `work/data/wsms.sqlite`; set `WSMS_DATA_DIR` for another directory and `PORT` for the port. Account sessions last seven days and are revoked on logout.

A static HTTP server alone no longer provides authentication or persistence. `server/local.mjs` serves the UI and API together. The Dockerfile supplies an equivalent Node runtime for Cloud Run; a file-backed SQLite database requires persistent storage and a single writer deployment. Cloud Run ephemeral disk alone does not persist a database across instances. Firebase/Firestore will remove that deployment constraint when integrated.

## Hosted Sites build

```sh
npm run build
```

This bundles the portable frontend and API into `dist/server/index.js`. Sites provisions SQLite-backed D1 via the DB binding and applies SQL migrations from drizzle/. Local SQLite and deployed D1 are separate databases. Keep `.openai/hosting.json` Site identity intact.

## Authentication and data

`dist/auth-client.js` exposes authProvider and layoutRepository adapters. `dist/auth.js` handles the landing page, account menu and ordered autosave queue. Replace these adapters when connecting Firebase Auth and Firestore; Firebase credentials and SDKs are not configured in this release.

Current server auth uses salted PBKDF2 password hashes, random opaque HttpOnly/SameSite session cookies (Secure on HTTPS), hashed session tokens in SQLite, auth throttling, same-origin JSON writes and ownership-based access. Layout payloads are structurally checked on the server. Shared-device logins load account data rather than old anonymous browser data. A visible explicit import action can recover a previous browser-local layout. JSON export/import remains under Overview.

Save failures stay pending for retry; logout flushes pending changes before revoking the session. The UI prompts before closing with unsaved changes. Data is not silently saved as a shared browser cache.

## Checks

Development checks live under tests/ in the GitHub repository. Run `for test in tests/*-test.mjs tests/ui-smoke.mjs; do node "$test" || exit; done`. UI smoke checks use DOM test doubles; they do not replace visual browser QA.

## Versions

VERSION tracks product releases independently of JSON schema version. Baseline v1 (1.00); minor changes +0.01, medium +0.10, major +1.00, using decimal arithmetic. Update CHANGELOG.md and release tags together.

Hosted session transport: the API also accepts the opaque session token in the Authorization header because Sites may filter app cookies. The browser keeps it in sessionStorage (tab-scoped), not URLs or persistent localStorage. Server-side token hashing, expiry and logout revocation remain in force. Avoid rendering untrusted HTML or third-party scripts that could access browser storage. Existing cookie sessions remain supported.

## Warehouse library and access

After login, Warehouses lists only owned or shared warehouses. Create a warehouse with name, country and location. New warehouse layouts start empty. Owners and editors launch Editor from the list; all three roles can open Overview and export data. The header does not expose an Editor shortcut. Rename warehouse metadata in Details.

- Owner: the immutable creator, can edit layouts/details and add, change or remove collaborators.
- Editor: can edit layouts and metadata but cannot manage access.
- Viewer: can read Overview and export; writes are rejected by the API.

Share by normalized account email. A grant to an unregistered address becomes effective when that address creates an account; this does not send email or bypass the Sites private audience gate. Firebase email verification remains a future integration. Access revocation is checked on subsequent server requests.

The 0001 migration adds warehouses and warehouse_members without changing existing users/sessions/layouts. Old personal layouts are imported into a private owner-only warehouse on the first list request, using a stable ID and INSERT OR IGNORE; repeated requests do not duplicate or overwrite it. Old unscoped layout routes return HTTP 410. All current reads and writes use /api/warehouses/:id/layout. Autosave queues are bound to the selected warehouse and flushed before switching. Failures appear in a retry notice rather than a header Saved label.
