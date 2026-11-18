# WSMS v3.05

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

Current server auth uses salted PBKDF2 password hashes, random opaque HttpOnly/SameSite session cookies (Secure on HTTPS), hashed session tokens in SQLite, auth throttling, same-origin JSON writes and ownership-based access. Layout payloads are structurally checked on the server. Shared-device logins load account data rather than old anonymous browser data. A visible explicit import action can recover a previous browser-local layout. Legacy browser layouts can be explicitly imported when opening an empty editable warehouse.

Save failures stay pending for retry; logout flushes pending changes before revoking the session. The UI prompts before closing with unsaved changes. Data is not silently saved as a shared browser cache.

## Checks

Development checks live under tests/ in the GitHub repository. Run `for test in tests/*-test.mjs tests/ui-smoke.mjs; do node "$test" || exit; done`. UI smoke checks use DOM test doubles; they do not replace visual browser QA.

## Versions

VERSION tracks product releases independently of JSON schema version. Baseline v1 (1.00); minor changes +0.01, medium +0.10, major +1.00, using decimal arithmetic. Update CHANGELOG.md and release tags together.

Hosted session transport: the API also accepts the opaque session token in the Authorization header because Sites may filter app cookies. The browser keeps it in sessionStorage (tab-scoped), not URLs or persistent localStorage. Server-side token hashing, expiry and logout revocation remain in force. Avoid rendering untrusted HTML or third-party scripts that could access browser storage. Existing cookie sessions remain supported.

## Warehouse library and access

After login, Warehouses lists only owned or shared warehouses. Create a warehouse with name, country and location. New warehouse layouts start empty. Owners and editors launch Editor from the list; all three roles can open Overview. The header does not expose an Editor shortcut. Rename warehouse metadata in Details.

- Owner: the immutable creator, can edit layouts/details and add, change or remove collaborators.
- Editor: can edit layouts and metadata but cannot manage access.
- Viewer: can read Overview; writes are rejected by the API.

Share by normalized account email. A grant to an unregistered address becomes effective when that address creates an account; this does not send email or bypass the Sites private audience gate. Firebase email verification remains a future integration. Access revocation is checked on subsequent server requests.

The 0001 migration adds warehouses and warehouse_members without changing existing users/sessions/layouts. Old personal layouts are imported into a private owner-only warehouse on the first list request, using a stable ID and INSERT OR IGNORE; repeated requests do not duplicate or overwrite it. Old unscoped layout routes return HTTP 410. All current reads and writes use /api/warehouses/:id/layout. Autosave queues are bound to the selected warehouse and flushed before switching. Failures appear in a retry notice rather than a header Saved label.

Overview header (v2.12): country and location come from warehouse details; the name dropdown switches among owned/shared warehouses after flushing pending saves. Warehouses comes before Overview in navigation. The floor filter is labelled Floor Management. JSON import/export and Excel download buttons are no longer exposed in Overview; the Excel Data grid remains.

Warehouse coordinates (v2.13): creation and Details updates require latitude (−90 to 90) and longitude (−180 to 180) in decimal degrees. Values are validated server-side and in the form. The append-only 0002 migration adds nullable checked columns without inventing coordinates for existing warehouses. Legacy warehouses are flagged and remain viewable; owners/editors must supply coordinates before layout edits are saved.

## Warehouse world map (v2.23)

Warehouses opens at full world extent using OpenStreetMap tiles. Each accessible warehouse with coordinates is a pin. Nearby warehouses form numbered clusters; clicking zooms into that area, with spiderfying for identical locations at maximum zoom. A pin zooms to street/city scale and opens a popup with warehouse details and permitted actions. World View resets the viewport, and returning to Warehouses starts at world extent.

Warehouses missing coordinates are displayed below the map with a Details action for owners/editors. Tile loading errors show an inline notice while retaining markers. The browser loads tiles directly from https://tile.openstreetmap.org with visible attribution and ordinary browser caching; no prefetching or bulk downloading. The map therefore needs internet access to the OSM tile service. Leaflet 1.9.4 and Leaflet.markercluster 1.5.3 are bundled locally, with licenses in THIRD_PARTY_NOTICES.md.

## Full-screen map and country search (v2.33)

The map fills the viewport below the top header; controls float over it. Default View now centres on the selected/first located warehouse at regional zoom, falling back to a closer global region if none exist. OSM tiles wrap horizontally to keep the view filled. Country search uses a local list of 241 countries/territories and generalized World Atlas/Natural Earth geometry, with common aliases. Selection draws a boundary and fits country bounds using responsive padding. Country coordinates are unwrapped across the dateline and warehouse pins follow the displayed world copy. No third-party geocoding requests are sent for search.

## Customers (v2.43)

Editor → Customers manages warehouse-scoped customers (required name, optional description and external customer ID). Customers are shared across the warehouse's floors. Assign a section customer in Customers or Section Properties; rack customer selectors are available in Customers and Racks.

Rack selectors distinguish Section Default, explicit Unassigned, and explicit customer overrides. Defaults follow later changes to the section; overrides stay unchanged. Choosing a customer marks the rack as assigned for occupancy shading and capacity totals. Existing manual assigned status is retained on legacy racks/sections until customer assignment is configured. Removing a customer clears matching section/rack references on every floor, retaining geometry and racks. Undo restores those changes.

Customer records are saved with each warehouse document and authorized by the warehouse role. Older version-5 documents lacking customer data load with an empty library; the JSON schema version stays 5. Server validation rejects dangling references, duplicate internal customer IDs and blank customer names. Customer details and effective assignments appear in Excel Data, including a Customers sheet.

## Tables and persistent templates (v2.53)

Overview views are Dashboard, Tables and Raw Data. Tables contains By Area (only floor/section space measurements), By Customer (section area by section customer, rack counts/footprints/pallet positions by effective customer after overrides, including Unassigned), and Templates. Floor Management scopes area/customer reports. Section allocations and rack allocations are independent measures, not additive.

The 0003 migration creates user_templates in SQLite/D1. Saving a rack type in Editor also saves/updates a personal rack template via templateRepository in auth-client.js. GET /api/templates safely backfills existing rack types from warehouses owned by that user, using stable warehouse/type source keys and INSERT OR IGNORE. Templates belong to the authenticated user and are not exposed to other accounts. The personal library spans warehouses; current warehouse rack types remain shared through warehouse permissions. Owners/editors can reuse personal templates into an editable warehouse, while viewers cannot change warehouse data. Exact duplicate rack types are not re-added.

Template saves are durable SQLite records, independent of the browser session and surviving process restart. Layouts, customers and assignments continue to save in each warehouse document. Firebase/Firestore is not connected; persistence/auth adapters remain isolated for the future integration.

## Foundation lines (v2.63)

In Foundation choose Draw Foundation Lines (L). Click points or drag segments; Shift constrains to horizontal/vertical. Lines snap to the grid and nearby line/foundation corners or edges. Closed bounded faces are filled as custom polygon foundations automatically, including intersections and outlines sharing an existing foundation edge. Open segments are stored per floor and remain unfilled. Escape/right-click ends the current chain, and open lines can be selected/deleted or cleared. Undo/redo covers both linework and created foundations.

Filled polygons retain normal move, bounding-dimension resize, rotation, wall toggles, entrances, floor copying and section containment. Converted boundary linework is consumed so moving a completed foundation cannot recreate an old footprint. Drafts support up to 300 lines/floor and polygons up to 128 corners. New floors copy completed foundations but not unfinished lines. Existing JSON schema version 5 stays compatible through optional normalized polygon points and foundationLines fields.

## Page routes

- /login (with a validated same-origin next path for direct links)
- /warehouses
- /warehouses/:id/editor (Foundation)
- /warehouses/:id/editor/sections, /racks, /customers
- /warehouses/:id/overview/dashboard
- /warehouses/:id/overview/tables/area, /customer, /templates
- /warehouses/:id/overview/raw-data/:sheet-slug

Floor selections use a floor query parameter. Native browser back/forward restores views, and the local server and hosted Worker serve the application shell at direct page routes. Assets use absolute URLs so deep-link refreshes work. API authorization still controls each warehouse request; viewers opening an Editor link are redirected to Overview.

## Working areas and capacity (v2.73)

Sections have distinct Enable Rack Placement and Mark as Working Area controls. Working areas represent walkways/loading/unloading and prohibit racks; enabling rack placement clears the working-area flag. Remove existing racks before marking a section as working area. Disabling rack placement alone does not reserve new sections. Older disabled sections retain their prior reserved meaning until explicitly changed.

Rack types and personal templates support 1–100 tiers (old records default to one). Usable rack area = length × width × tiers. Physical ground footprint remains length × width, and pallet positions remain the manually entered total per rack regardless of tiers. Ground-area checks and map divisions continue to use physical footprint.

Dashboard cards show: union of rack-enabled/working sections versus foundation area; assigned versus installed usable rack area across tiers; assigned versus installed manual pallet positions with percentage; assigned section area divided by distinct customers with assigned sections in the selected floors. Customer section area uses a union per customer per floor; the overlap warning still applies between different customers. All data persists in existing SQLite/D1 warehouse documents and personal templates.

## Workspace navigation and foundation dock

Overview opens the warehouse map; Warehouse contains Dashboard, Tables and Raw Data. Enter Editor opens editing and reveals the Editor header tab only during editing. Existing deep links remain supported. Foundations use the bottom dock with shape previews, name and area; Draw opens building blocks including linework. Select a card for properties and wall controls. Switch to Entrances & exits to add and edit openings and their usage. Floors are available from the dock; Sections share the bottom dock with foundations. Racks and Customers remain in the right panel. M selects movement; R rotates the selected foundation, section or opening 90° in place. Right-drag pans; wheel scrolling zooms.

Racks are grouped by section in the right panel. Add opens a rack dialog with saved type selection, rack name, dimensions, tiers, manual pallet positions and customer inheritance/override. Rack menus provide Edit and Delete. Custom dimensions can optionally be saved to the personal template library; changing a rack creates/reuses its own dimension record without altering other racks.

The editor legend summarizes the active floor: foundation union area in m² and percentages of floor area for sections, assigned/unassigned rack footprints and working areas. Section totals include their racks and working areas; categories overlap.
