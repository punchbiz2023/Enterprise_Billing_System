CREATE TABLE IF NOT EXISTS "bill" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"billnumber" text NOT NULL,
	"orderno" text NOT NULL,
	"billdate" date NOT NULL,
	"duedate" date NOT NULL,
	"terms" text NOT NULL,
	"modeofshipment" text,
	"itemdetails" json NOT NULL,
	"gst" numeric NOT NULL,
	"total" numeric NOT NULL,
	"loggedUser" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "creditnote" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creditno" text NOT NULL,
	"refno" text NOT NULL,
	"creditdate" date NOT NULL,
	"itemdetails" json,
	"subject" text NOT NULL,
	"notes" text NOT NULL,
	"terms" text NOT NULL,
	"salesperson" text NOT NULL,
	"taxtype" text NOT NULL,
	"taxrate" text NOT NULL,
	"amount" numeric,
	"loggedUser" text NOT NULL
);
--> statement-breakpoint
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
	"shipaddress" json NOT NULL,
	"loggedUser" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "estimate" (
	"sno" serial PRIMARY KEY NOT NULL,
	"cname" text NOT NULL,
	"quotenum" text NOT NULL,
	"refnum" text,
	"qdate" date NOT NULL,
	"expdate" date NOT NULL,
	"project" text NOT NULL,
	"itemtable" json NOT NULL,
	"subject" text,
	"salesperson" text NOT NULL,
	"taxtype" text NOT NULL,
	"taxrate" text NOT NULL,
	"total" numeric NOT NULL,
	"loggedUser" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_name" text NOT NULL,
	"item_code" text NOT NULL,
	"hsn_code" text NOT NULL,
	"quantity" numeric NOT NULL,
	"rate" numeric NOT NULL,
	"gst" numeric NOT NULL,
	"loggedUser" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"state" text NOT NULL,
	"phone" text NOT NULL,
	"mail" text NOT NULL,
	"invoiceid" text NOT NULL,
	"invdate" date NOT NULL,
	"duedate" date NOT NULL,
	"terms" text NOT NULL,
	"subject" text NOT NULL,
	"salesperson" text NOT NULL,
	"taxtype" text NOT NULL,
	"taxrate" text NOT NULL,
	"amount" numeric,
	"loggedUser" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"unit" text NOT NULL,
	"itemCode" text,
	"hsnCode" text,
	"salesprice" numeric NOT NULL,
	"costprice" numeric NOT NULL,
	"salesdescription" text,
	"purchasedescription" text,
	"salesaccount" text NOT NULL,
	"purchaseaccount" text NOT NULL,
	"taxPayable" boolean,
	"gst" numeric(5, 2),
	"quantity" numeric NOT NULL,
	"openingStock" numeric NOT NULL,
	"loggedUser" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"pcode" text NOT NULL,
	"cname" text NOT NULL,
	"billmethod" text NOT NULL,
	"total" numeric NOT NULL,
	"description" text NOT NULL,
	"costbudget" text NOT NULL,
	"revenuebudget" text NOT NULL,
	"projecthours" text NOT NULL,
	"users" json NOT NULL,
	"tasks" json NOT NULL,
	"loggedUser" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purchaseorder" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"delivery" text NOT NULL,
	"orderno" text NOT NULL,
	"ref" text,
	"date" date NOT NULL,
	"deliverydate" date NOT NULL,
	"terms" text NOT NULL,
	"modeofshipment" text,
	"itemdetails" json NOT NULL,
	"gst" numeric NOT NULL,
	"total" numeric NOT NULL,
	"loggedUser" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "salesorder" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"state" text NOT NULL,
	"caddress" text NOT NULL,
	"contact" text NOT NULL,
	"mail" text NOT NULL,
	"invoiceid" text NOT NULL,
	"orderno" text NOT NULL,
	"orderdate" date NOT NULL,
	"shipmentdate" date NOT NULL,
	"invoicedate" date NOT NULL,
	"duedate" date NOT NULL,
	"terms" text NOT NULL,
	"itemdetails" json NOT NULL,
	"subject" text,
	"salesperson" text NOT NULL,
	"taxtype" text NOT NULL,
	"taxrate" text NOT NULL,
	"total" numeric NOT NULL,
	"loggedUser" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "salesperson" (
	"sno" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"mail" text NOT NULL,
	"loggedUser" text NOT NULL
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
	"docs" text,
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_mail_unique" UNIQUE("mail")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor" (
	"sno" serial PRIMARY KEY NOT NULL,
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
	"shipaddress" json NOT NULL,
	"loggedUser" text NOT NULL
);
