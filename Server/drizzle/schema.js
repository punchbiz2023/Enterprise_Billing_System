import { pgTable, serial, text, numeric, json, date } from 'drizzle-orm/pg-core';

export const CustTable = pgTable('customer', {
  sno: serial('sno').primaryKey(),
  type: text('type').notNull(),
  name: text('name').notNull(),
  company: text('company').notNull(),
  dispname: text('dispname').notNull(),
  mail: text('mail').notNull(),
  workphone: text('workphone').notNull(),
  mobilephone: text('mobilephone').notNull(),
  panno: text('panno').notNull(),
  gstno: text('gstno').notNull(),
  currency: text('currency').notNull(),
  openingbalance: numeric('openingbalance').notNull(),
  paymentterms: text('paymentterms').notNull(),
  billaddress: json('billaddress').notNull(),
  shipaddress: json('shipaddress').notNull(),
});

export const VendTable = pgTable('vendor', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  company: text('company').notNull(),
  dispname: text('dispname').notNull(),
  mail: text('mail').notNull(),
  workphone: text('workphone').notNull(),
  mobilephone: text('mobilephone').notNull(),
  panno: text('panno').notNull(),
  gstno: text('gstno').notNull(),
  currency: text('currency').notNull(),
  openingbalance: numeric('openingbalance').notNull(),
  paymentterms: text('paymentterms').notNull(),
  billaddress: json('billaddress').notNull(),
  shipaddress: json('shipaddress').notNull(),
});

export const Items = pgTable('items', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  type: text("type").notNull(),
  unit: text('unit').notNull(),
  salesprice: numeric('salesprice').notNull(),
  costprice: numeric('costprice').notNull(),
  salesdescription: text('salesdescription'),
  purchasedescription: text('purchasedescription'),
  salesaccount: text('salesaccount').notNull(),
  purchaseaccount: text('purchaseaccount').notNull(),
});

export const Users = pgTable('users',{
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  mail: text('mail').notNull(),
  password: text('password').notNull(),
  address: text('address').notNull(),
  phone: numeric('phone').notNull(),
  gst: text('gst').notNull(),
  pan: text('pan').notNull(),
  docs: text('docs')
})

export const Estimate = pgTable('estimate',{
  sno: serial('sno').primaryKey(),
  cname: text('cname').notNull(),
  quotenum: text('quotenum').notNull(),
  refnum: text('refnum'),
  qdate: date('qdate').notNull(),
  expdate: date('expdate').notNull(),
  salesperson: text('salesperson').notNull(),
  project: text('project').notNull(),
  subject: text('subject'),
  itemtable: json('itemtable').notNull(),
  subtotal: json('subtotal').notNull()
})


export const SalesPerson = pgTable('salesperson',{
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  mail: text('mail').notNull()
})