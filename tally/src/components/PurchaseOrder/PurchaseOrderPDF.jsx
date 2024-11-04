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
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  flexColumn: {
    flexDirection: 'column',
    width: '50%',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 20,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
    textAlign: 'center',
    borderColor: '#000',
  },
  tableColSmall: {
    width: '10%', // Adjust the size for the "#" and "Qty" columns
  },
  tableColMedium: {
    width: '20%', // Adjust for "Rate" and "Amount"
  },
  tableColLarge: {
    width: '60%', // Adjust for "Item"
    textAlign: 'left',
  },
  summaryBlock: {
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    padding: 10,
    borderColor: '#000',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
  },
  summaryLabel: {
    fontWeight: 'bold',
    textAlign: 'left',
    width: '70%',
  },
  summaryValue: {
    textAlign: 'right',
    width: '30%',
  },
  footer: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 10,
    color: '#555',
  },
});

const PurchaseOrderPDF = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        {/* Header Section */}
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Purchase Order</Text>
          </View>
        </View>

        {/* Vendor and Purchase Order Details */}
        <View style={styles.details}>
          <View style={styles.flexColumn}>
            <Text style={styles.boldText}>Vendor: {formData.vendor}</Text>
            <Text style={styles.boldText}>Email: {formData.vendorEmail}</Text>
            <Text style={styles.boldText}>Reference Number: {formData.reference}</Text>
            <Text style={styles.boldText}>Shipment Preference: {formData.shipmentPreference}</Text>
          </View>
          <View style={styles.flexColumn}>
            <Text style={styles.boldText}>PO Number: {formData.purchaseOrderNo}</Text>
            <Text>Date: {formData.date}</Text>
            <Text>Delivery Date: {formData.deliveryDate}</Text>
            <Text style={styles.boldText}>Payment terms: {formData.paymentTerms}</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableColSmall, styles.boldText]}>S.no</Text>
            <Text style={[styles.tableCol, styles.tableColLarge, styles.boldText]}>Item</Text>
            <Text style={[styles.tableCol, styles.tableColSmall, styles.boldText]}>Qty</Text>
            <Text style={[styles.tableCol, styles.tableColMedium, styles.boldText]}>Rate</Text>
            <Text style={[styles.tableCol, styles.tableColMedium, styles.boldText]}>Amount</Text>
          </View>

          {/* Table Rows */}
          {formData.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableColSmall]}>{index + 1}</Text>
              <Text style={[styles.tableCol, styles.tableColLarge]}>{item.account}</Text>
              <Text style={[styles.tableCol, styles.tableColSmall]}>{item.quantity}</Text>
              <Text style={[styles.tableCol, styles.tableColMedium]}>{item.rate}</Text>
              <Text style={[styles.tableCol, styles.tableColMedium]}>{item.quantity * item.rate}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{formData.subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST ({formData.gstPercentage}%):</Text>
            <Text style={styles.summaryValue}>{formData.gstAmount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Grand Total:</Text>
            <Text style={styles.summaryValue}>{formData.grandTotal}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Thank you for your order!</Text>
      </View>
    </Page>
  </Document>
);

export default PurchaseOrderPDF;