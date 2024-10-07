import React from 'react';
import logo from '../../assets/Punchbiz_logo.jpg';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf',
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Open Sans',
    padding: 40,
    fontSize: 12,
    lineHeight: 1.6,
    color: '#333',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  body: {
    marginTop: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  titleWrapper: {
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    letterSpacing: 1,
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
    alignItems: 'flex-start',
    width: '50%',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '50%',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  table: {
    display: 'table',
    width: '100%',
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
    width: '30%',
    textAlign: 'left',
    fontWeight: 'bold',
    paddingRight: 10,
  },
  summaryValue: {
    width: '90%',
    textAlign: 'right',
  },
  footer: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 10,
    color: '#555',
  },
  rightFooterDetails: {
    textAlign: 'right',
    marginTop: 10,
    fontSize: 10,
    position: 'absolute',
    bottom: 40,
    right: 40,
  },
});

const InvoicePDF = ({ formData }) => {
  console.log(formData);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.body}>
          {/* Header Section */}
          <View style={styles.header}>
            {/* Logo aligned to the left */}
            <Image src={logo} style={styles.logo} />
            
            {/* Title aligned at the center */}
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>INVOICE</Text>
            </View>
          </View>

          {/* Bill To Section */}
          <View style={styles.invoiceDetails}>
            <View style={styles.flexColumn}>
              <Text style={styles.boldText}>Bill To:</Text>
              <Text>{formData.customerAddress}</Text>
            </View>

            {/* Invoice ID and Date aligned to the right */}
            <View style={styles.rightColumn}>
              <Text style={styles.boldText}>Invoice ID: {formData.invoiceNumber}</Text>
              {/* <Text></Text> */}
              <Text style={styles.boldText}>Invoice Date: {formData.invoiceDate}</Text>
              {/* <Text></Text> */}
            </View>
          </View>

          {/* Table Header */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.boldText]}>#</Text>
              <Text style={[styles.tableColDescription, styles.boldText]}>Item</Text>
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

          {/* Summary Block */}
          <View style={styles.summaryBlock}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub Total: </Text>
              <Text style={styles.summaryValue}>{formData.subTotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax Rate: </Text>
              <Text style={styles.summaryValue}>{formData.tax}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total: </Text>
              <Text style={styles.summaryValue}>{formData.total}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total In Words: </Text>
              <Text style={styles.summaryValue}>{formData.totalInWords}</Text>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>Thank you for your business!</Text>

          {/* Invoice ID and Date at the bottom right
          <View style={styles.rightFooterDetails}>
            <Text style={styles.boldText}>Invoice ID: {formData.invoiceId}</Text>
            <Text style={styles.boldText}>Invoice Date: {formData.invoiceDate}</Text>
          </View> */}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
