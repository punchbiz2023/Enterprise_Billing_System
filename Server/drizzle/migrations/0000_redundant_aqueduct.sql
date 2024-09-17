CREATE TABLE IF NOT EXISTS "customer" (
	"sno" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"company" text NOT NULL,
	"dispname" text NOT NULL,
	"mail" text NOT NULL,
	"workphone" text NOT NULL,
	"mobilephone" text NOT NULL,
	"panno" text NOT NULL,
	"gstno" text NOT NULL,
	"currency" text NOT NULL,
	"openingbalance" numeric NOT NULL,
	"paymentterms" text NOT NULL,
	"billaddress" json NOT NULL,
	"shipaddress" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"unit" text NOT NULL,
	"salesprice" numeric NOT NULL,
	"costprice" numeric NOT NULL,
	"salesdescription" text,
	"purchasedescription" text,
	"salesaccount" text NOT NULL,
	"purchaseaccount" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"mail" text NOT NULL,
	"password" text NOT NULL,
	"address" text NOT NULL,
	"phone" numeric NOT NULL,
	"gst" text NOT NULL,
	"pan" text NOT NULL,
	"docs" text
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
