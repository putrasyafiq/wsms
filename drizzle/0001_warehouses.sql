CREATE TABLE warehouses (id TEXT PRIMARY KEY NOT NULL, owner_id TEXT NOT NULL REFERENCES users(id), name TEXT NOT NULL, country TEXT NOT NULL DEFAULT '', location TEXT NOT NULL DEFAULT '', document TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE warehouse_members (warehouse_id TEXT NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE, email TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('editor','viewer')), added_at INTEGER NOT NULL, PRIMARY KEY (warehouse_id, email));
--> statement-breakpoint
CREATE INDEX warehouse_members_email_idx ON warehouse_members (email);
--> statement-breakpoint
CREATE INDEX warehouses_owner_id_idx ON warehouses (owner_id);
