# WSMS

Warehouse Space Management System — **v1**.

A portable browser application for scaled warehouse layouts, independent floors, foundations, wall segments, entrances, storage and reserved sections, rack types, and assigned/unassigned rack capacity. Overview includes a layout-based capacity dashboard, grouped tables and an Excel grid with XLSX export.

## Run

Serve `dist/` using any static HTTP server, for example:

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. No build, dependencies or Sites SDK are required. The same static files can be served from a Cloud Run container.

Data saves in browser localStorage. JSON export/import transfers the entire layout, including floors and rack assignments. There is no shared backend yet. Rack maps represent proportional floor area, not individual rack positions. Whitespace excludes installed rack footprints and reserved non-storage sections; aisles and operational clearances are not automatically reserved. Overlapping sections trigger a planning warning.

## Checks

With Node.js 22 or later:

```sh
for test in tests/*-test.mjs tests/ui-smoke.mjs; do node "$test" || exit; done
```

The UI smoke check uses DOM test doubles; it is not visual browser verification. Report tests write a sample workbook to `/tmp/wsms-capacity-test.xlsx`.

## Versions

`VERSION` tracks the product release independently of the browser data schema.

- Baseline: **v1** (`1.00`).
- Minor change: add **0.01**.
- Medium change: add **0.10**.
- Major change: add **1.00**.

Use decimal arithmetic. For example, v1 → v1.01 → v1.11 → v2.11. Record each delivered change in CHANGELOG.md and tag releases.
