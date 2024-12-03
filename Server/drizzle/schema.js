import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  json,
  date,
  boolean,
  decimal,
} from 'drizzle-orm/pg-core';

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
  loggedUser: text('loggedUser').notNull()
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
  loggedUser: text('loggedUser').notNull()
});

export const Items = pgTable('items', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  unit: text('unit').notNull(),
  itemcode: text('itemCode'),
  hsncode: text('hsnCode'),
  salesprice: numeric('salesprice').notNull(),
  costprice: numeric('costprice').notNull(),
  salesdescription: text('salesdescription'),
  purchasedescription: text('purchasedescription'),
  salesaccount: text('salesaccount').notNull(),
  purchaseaccount: text('purchaseaccount').notNull(),
  taxpayable: boolean('taxPayable'),
  gst: decimal('gst', { precision: 5, scale: 2 }),
  quantity: numeric('quantity').notNull(),
  openingstock: numeric('openingStock').notNull(),
  loggedUser: text('loggedUser').notNull()
});

export const Users = pgTable('users', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull().unique(),
  mail: text('mail').notNull().unique(),
  password: text('password').notNull(),
  address: text('address').notNull(),
  phone: numeric('phone').notNull(),
  gst: text('gst').notNull(),
  pan: text('pan').notNull(),
  docs: text('docs'),
});

export const Estimate = pgTable('estimate', {
  sno: serial('sno').primaryKey(),
  cname: text('cname').notNull(),
  quotenum: text('quotenum').notNull(),
  refnum: text('refnum'),
  qdate: date('qdate').notNull(),
  expdate: date('expdate').notNull(),
  project: text('project').notNull(),
  itemtable: json('itemtable').notNull(),
  subject: text('subject'),
  salesperson: text('salesperson').notNull(),
  taxtype: text('taxtype').notNull(),
  taxrate: text('taxrate').notNull(),
  total: numeric('total').notNull(),
  loggedUser: text('loggedUser').notNull()
});

export const Project = pgTable('project', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  pcode: text('pcode').notNull(),
  cname: text('cname').notNull(),
  billmethod: text('billmethod').notNull(),
  total: numeric('total').notNull(),
  description: text('description').notNull(),
  costbudget: text('costbudget').notNull(),
  revenuebudget: text('revenuebudget').notNull(),
  projecthours: text('projecthours').notNull(),
  users: json('users').notNull(),
  tasks: json('tasks').notNull(),
  loggedUser: text('loggedUser').notNull()
});

export const SalesPerson = pgTable('salesperson', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  mail: text('mail').notNull(),
  loggedUser: text('loggedUser').notNull()
});

export const PurchaseOrder = pgTable('purchaseorder', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  delivery: text('delivery').notNull(),
  orderno: text('orderno').notNull(),
  ref: text('ref'),
  date: date('date').notNull(),
  deliverydate: date('deliverydate').notNull(),
  terms: text('terms').notNull(),
  modeofshipment: text('modeofshipment'),
  itemdetails: json('itemdetails').notNull(),
  gst: numeric('gst').notNull(),
  total: numeric('total').notNull(),
  loggedUser: text('loggedUser').notNull()

});

export const Invoice = pgTable('invoice', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  state: text('state').notNull(),
  phone: text('phone').notNull(),
  mail: text('mail').notNull(),
  invoiceid: text('invoiceid').notNull(),
  invdate: date('invdate').notNull(),
  duedate: date('duedate').notNull(),
  terms: text('terms').notNull(),
  subject: text('subject').notNull(),
  salesperson: text('salesperson').notNull(),
  taxtype: text('taxtype').notNull(),
  taxrate: text('taxrate').notNull(),
  amount: numeric('amount'),
  loggedUser: text('loggedUser').notNull()
});

export const BillForm = pgTable('bill', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  billnumber: text('billnumber').notNull(),
  orderno: text('orderno').notNull(),
  billdate: date('billdate').notNull(),
  duedate: date('duedate').notNull(),
  terms: text('terms').notNull(),
  modeofshipment: text('modeofshipment'),
  itemdetails: json('itemdetails').notNull(),
  gst: numeric('gst').notNull(),
  total: numeric('total').notNull(),
  loggedUser: text('loggedUser').notNull()
});

export const SalesOrder = pgTable('salesorder', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  state: text('state').notNull(),
  caddress: text('caddress').notNull(),
  contact: text('contact').notNull(),
  mail: text('mail').notNull(),
  invoiceid: text('invoiceid').notNull(),
  orderno: text('orderno').notNull(),
  orderdate: date('orderdate').notNull(),
  shipmentdate: date('shipmentdate').notNull(),
  invoicedate: date('invoicedate').notNull(),
  duedate: date('duedate').notNull(),
  terms: text('terms').notNull(),
  itemdetails: json('itemdetails').notNull(),
  subject: text('subject'),
  salesperson: text('salesperson').notNull(),
  taxtype: text('taxtype').notNull(),
  taxrate: text('taxrate').notNull(),
  total: numeric('total').notNull(),
  loggedUser: text('loggedUser').notNull()
});

// Inventory Table Definition
export const InventoryTable = pgTable('inventory', {
  id: serial('id').primaryKey(),
  itemName: text('item_name').notNull(),
  itemCode: text('item_code').notNull(),
  hsnCode: text('hsn_code').notNull(),
  quantity: numeric('quantity').notNull(), // Use numeric or decimal here
  rate: numeric('rate').notNull(), // Use numeric or decimal here
  gst: numeric('gst').notNull(), // Use numeric or decimal here
  loggedUser: text('loggedUser').notNull()
});


export const CreditNote = pgTable('creditnote', {
  sno: serial('sno').primaryKey(),
  name: text('name').notNull(),
  creditno: text('creditno').notNull(),
  refno: text('refno').notNull(),
  creditdate: date('creditdate').notNull(),
  itemdetails: json('itemdetails'),
  subject: text('subject').notNull(),
  notes: text('notes').notNull(),
  terms: text('terms').notNull(),
  salesperson: text('salesperson').notNull(),
  taxtype: text('taxtype').notNull(),
  taxrate: text('taxrate').notNull(),
  amount: numeric('amount'),
  loggedUser: text('loggedUser').notNull()
});

// // Journal Table
// export const Journal = pgTable('journal', {
//   id: serial('id').primaryKey(),
//   date: date('date').notNull(),
//   journalNumber: varchar('journal_number', { length: 50 }).notNull(),
//   description: text('description').notNull(),
//   referenceNumber: varchar('reference_number', { length: 50 }),
//   accounts: jsonb('accounts').notNull(),
//   totalDebit: numeric('total_debit').notNull(),
//   totalCredit: numeric('total_credit').notNull(),
// });
  
  