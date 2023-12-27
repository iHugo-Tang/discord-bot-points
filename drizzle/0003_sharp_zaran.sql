CREATE TABLE IF NOT EXISTS "logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"desc" text DEFAULT '' NOT NULL,
	"type" integer DEFAULT 1 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL
);
