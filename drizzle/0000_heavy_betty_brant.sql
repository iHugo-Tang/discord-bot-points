CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"discord_uid" text NOT NULL,
	"discord_username" text NOT NULL,
	"points" integer DEFAULT 0 NOT NULL
);
