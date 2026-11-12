CREATE TABLE user_templates (id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL REFERENCES users(id), kind TEXT NOT NULL CHECK (kind IN ('rack')), source_key TEXT NOT NULL, name TEXT NOT NULL, data TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, UNIQUE (user_id, source_key));
--> statement-breakpoint
CREATE INDEX user_templates_user_id_idx ON user_templates (user_id);
