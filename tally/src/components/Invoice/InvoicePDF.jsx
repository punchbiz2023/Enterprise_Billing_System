import React from 'react'

import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf'
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Open Sans',
    padding: 40,
    fontSize: 12,
    lineHeight: 1.6,
    color: '#333',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  invoiceDetails: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '10%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: 'center',
    borderColor: '#000',
  },
  tableColDescription: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: 'left',
    borderColor: '#000',
  },
  tableColQty: {
    width: '10%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: 'center',
    borderColor: '#000',
  },
  tableColAmount: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: 'right',
    borderColor: '#000',
  },
  summaryBlock: {
    marginTop: 20,
    marginLeft: 'auto',
    width: '80%',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderStyle: 'solid',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '4px 0',
  },
  summaryLabel: {
    width: '50%',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  summaryValue: {
    width: '50%',
    textAlign: 'right',
  },
  footer: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 10,
    color: '#555',
  },
});


const InvoicePDF = ({ formData }) => {
  console.log(formData);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* <Image src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/..." style={styles.logo} /> */}
          <Text style={styles.title}>INVOICE</Text>
        </View>

        {/* Bill To & Ship To */}
        <View style={styles.invoiceDetails}>
          <View style={styles.flexColumn}>
            <Text style={styles.boldText}>Bill To:</Text>
            <Text>{formData.customerAddress}</Text>     
          </View>
          
        </View>

        {/* Table Header */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.boldText]}>#</Text>
            <Text style={[styles.tableColDescription, styles.boldText]}>Item </Text>
            <Text style={[styles.tableColQty, styles.boldText]}>Qty</Text>
            <Text style={[styles.tableColQty, styles.boldText]}>Rate</Text>
            <Text style={[styles.tableColQty, styles.boldText]}>Discount</Text>
            <Text style={[styles.tableColAmount, styles.boldText]}>Amount</Text>
          </View>

          {/* Table Rows */}
          {formData.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{index + 1}</Text>
              <Text style={styles.tableColDescription}>{item.item}</Text>
              <Text style={styles.tableColQty}>{item.quantity}</Text>
              <Text style={styles.tableColQty}>{item.rate}</Text>
              <Text style={styles.tableColQty}>{item.discount}</Text>
              <Text style={styles.tableColAmount}>{item.amount}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sub Total</Text>
            <Text style={styles.summaryValue}>{formData.subTotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax Rate</Text>
            <Text style={styles.summaryValue}>{formData.tax}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{formData.total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total In Words</Text>
            <Text style={styles.summaryValue}>{formData.totalInWords}</Text>
          </View>
         
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Thank you for your business!</Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF
