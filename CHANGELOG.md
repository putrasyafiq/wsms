# Changelog

## v2.00 — 2026-11-12

Major change: email/password accounts, login and logout, a warehouse-style landing page, server-side SQLite persistence, account-isolated warehouse documents, and an email account menu. Local Node.js uses a SQLite file; Sites uses SQLite-backed D1. Frontend auth and layout adapters isolate the eventual Firebase Auth / Firestore replacement. Legacy browser layouts require explicit account import. Existing layout editor, floors, capacity reporting and Excel exports remain available.

Validation: SQLite auth and account isolation, secure-session lifecycle, persistence across local HTTP server restart, server-side document validation, save retry/ordering, and existing geometry/report/editor checks. Shared browser startup remains blocked by the environment.

## v1 — 2026-11-11

Initial release of the current WSMS application: scaled polygon layouts, foundation walls and entrances, separate floors, storage/reserved sections, rack types and assignments, Overview dashboard using the layout as a capacity map, grouped reports, Excel export, and linked section hover highlighting.

Validation: geometry, floor isolation, racks, entrances, reporting, reserved capacity and UI interaction checks. Visual browser testing remains unverified in the development environment.
