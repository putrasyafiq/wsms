# Changelog

## v2.53 — 2026-11-12

Medium update (+0.10): renamed Overview views to Dashboard, Tables and Raw Data. Tables now has By Area (space-only floor/section breakdowns), By Customer (dedicated areas and effective customer rack groups), and Templates. Added a personal SQLite-backed rack template library shared across a user’s warehouses, automatic personal template saving from Rack Editor, safe backfill of owned warehouse rack types, and reuse into editable warehouses. Existing warehouse data remains persisted in SQLite/D1.

## v2.43 — 2026-11-12

Medium update (+0.10): Customers editor tab with required name and optional description/customer ID. Customers belong to a warehouse and span its floors. Sections can choose a default customer; racks inherit dynamically or explicitly override with another customer/unassigned. Assignments drive rack status/capacity shading, preserve legacy manual status until customer assignment is configured, and persist through floor changes and autosave. Customer deletion clears matching references without removing sections/racks. Server validates customer references and reports include customer data.

## v2.33 — 2026-11-12

Medium update (+0.10): Warehouses map now fills the viewport below the header, without a page frame or borders. Labels, search, add/reset controls and missing-location notices float over the map. Default view is a closer warehouse-centred region rather than whole-world fit, with wrapped OSM tiles avoiding blank margins. Added local country search with suggestions/keyboard selection, country boundary outlines and fitted bounds, including dateline-aware country geometry.

## v2.23 — 2026-11-12

Medium update (+0.10): Warehouses is now an OpenStreetMap world map, with accessible location pins and numbered clusters. Cluster clicks zoom to reveal nearby locations; identical locations spiderfy at maximum zoom. Pin clicks zoom to a details popup containing role-appropriate workspace and access actions. World View resets the map; returning to Warehouses starts at world view. Missing-coordinate warehouses remain available below the map. Leaflet and MarkerCluster are locally bundled with license notices and OSM tile attribution.

## v2.13 — 2026-11-12

Minor update (+0.01): warehouse creation and metadata updates require latitude and longitude in decimal degrees. Client and server validate latitude −90…90 and longitude −180…180, including zero. Existing warehouses retain nullable coordinates, are flagged in the list, and require coordinates before layout editing; read-only access is preserved.

## v2.12 — 2026-11-12

Minor update (+0.01): Warehouses precedes Overview in the header. The Overview title is now a permitted-warehouse dropdown, with country above and location below. Switching waits for pending saves and retains the current warehouse if loading fails. Removed Overview JSON import/export, Excel download and role controls; renamed Reporting scope to Floor Management.

## v2.11 — 2026-11-12

Medium feature update (+0.10): warehouse library with separate layout documents, name/country/location details and per-warehouse owner/editor/viewer roles. Owners share or revoke access by email; editors edit details and layouts; viewers have read-only Overview and export access. Header now shows Overview and Warehouses, with email followed by avatar and no Saved label. Editor launches from the warehouse list. Existing account layouts migrate privately and idempotently on first listing.

## v2.01 — 2026-11-12

Fix hosted login when the Sites gateway does not carry the app session cookie through to later requests. The client now carries the same opaque, revocable session token in an Authorization header, scoped to the browser tab with sessionStorage; HttpOnly cookies remain supported locally. Passwords and existing accounts are unchanged. Regression checks strip all cookies and verify registration, login, layout loading, page reload and logout.

## v2.00 — 2026-11-12

Major change: email/password accounts, login and logout, a warehouse-style landing page, server-side SQLite persistence, account-isolated warehouse documents, and an email account menu. Local Node.js uses a SQLite file; Sites uses SQLite-backed D1. Frontend auth and layout adapters isolate the eventual Firebase Auth / Firestore replacement. Legacy browser layouts require explicit account import. Existing layout editor, floors, capacity reporting and Excel exports remain available.

Validation: SQLite auth and account isolation, secure-session lifecycle, persistence across local HTTP server restart, server-side document validation, save retry/ordering, and existing geometry/report/editor checks. Shared browser startup remains blocked by the environment.

## v1 — 2026-11-11

Initial release of the current WSMS application: scaled polygon layouts, foundation walls and entrances, separate floors, storage/reserved sections, rack types and assignments, Overview dashboard using the layout as a capacity map, grouped reports, Excel export, and linked section hover highlighting.

Validation: geometry, floor isolation, racks, entrances, reporting, reserved capacity and UI interaction checks. Visual browser testing remains unverified in the development environment.
