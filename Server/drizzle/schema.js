import { pgTable, serial, text, numeric } from 'drizzle-orm/pg-core';

export const CustTable = pgTable('user', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  company: text('company').notNull(),
  mail: text('mail').notNull(),
  gstno: text('gstno').notNull(),
  phone: text('phone').notNull(),
  amountToBeReceived: numeric('amount_to_be_received').notNull()
});

export const VendTable = pgTable('vendor', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  company: text('company').notNull(),
  mail: text('mail').notNull(),
  gstno: text('gstno').notNull(),
  phone: text('phone').notNull(),
  amountToBeReceived: numeric('amount_to_be_received').notNull()
});

