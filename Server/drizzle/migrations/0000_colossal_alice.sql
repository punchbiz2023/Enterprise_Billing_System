CREATE TABLE IF NOT EXISTS "user" (
	"sno" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"company" varchar NOT NULL,
	"mail" varchar NOT NULL,
	"gstno" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"amount_to_be_received" integer NOT NULL
);
