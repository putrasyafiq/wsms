ALTER TABLE warehouses ADD COLUMN latitude REAL CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));
--> statement-breakpoint
ALTER TABLE warehouses ADD COLUMN longitude REAL CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));
