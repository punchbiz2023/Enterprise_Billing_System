CREATE TABLE IF NOT EXISTS "user" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company" text NOT NULL,
	"mail" text NOT NULL,
	"gstno" text NOT NULL,
	"phone" text NOT NULL,
	"amount_to_be_received" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company" text NOT NULL,
	"mail" text NOT NULL,
	"gstno" text NOT NULL,
	"phone" text NOT NULL,
	"amount_to_be_received" numeric NOT NULL
);
