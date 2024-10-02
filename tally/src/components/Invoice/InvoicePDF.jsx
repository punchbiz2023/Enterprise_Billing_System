import React from 'react'

import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';


const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  logo: {
    width: 60,
    height: 60,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  box: {
    padding: 15,
    borderRadius: 5,
    border: '1px solid #ddd',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  table: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 20,
  },
  tableRow: {
    display: 'table-row',
  },
  tableCol: {
    display: 'table-cell',
    border: '1px solid #ddd',
    padding: 8,
    textAlign: 'left',
    verticalAlign: 'top',
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
    border: '1px solid #ddd',
    padding: 8,
    textAlign: 'center',
  },
  tableCell: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    border: '1px solid #ddd',
    padding: 8,
    textAlign: 'center',
  },
  totals: {
    marginTop: 20,
    borderTop: '2px solid #000',
    paddingTop: 10,
    fontWeight: 'bold',
    fontSize: 14,
  },
  signature: {
    marginTop: 30,
    fontSize: 12,
    textAlign: 'center',
    borderTop: '1px solid #ddd',
    paddingTop: 10,
  },
});



const InvoicePDF = ({ formData }) => {
  console.log(formData);
  
  return (
    <>

      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Image src="data:image/jpeg;base64,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" style={styles.logo} />
            <Text style={styles.header}>TAX INVOICE</Text>
            <Text style={styles.subheader}>PUNCHBIZ</Text>
          </View>
          <View style={styles.box}>
            <Text>Invoice #: {formData.invoiceNumber}</Text>
            <Text>Invoice Date: {formData.invoiceDate}</Text>
            <Text>Due Date: {formData.dueDate}</Text>
            <Text>Terms: {formData.terms}</Text>
            <Text>P.O. #: 12345</Text>
          </View>
          <View style={styles.box}>
            <Text>Bill To: {formData.customerName}</Text>
            <Text>Address: {formData.customerAddress}</Text>
            <Text>Phone: {formData.customerPh}</Text>
            <Text>Email: {formData.customerMail}</Text>
          </View>
          <Text>Subject: {formData.subject}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Item & Description</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Qty</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Rate</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Amount</Text>
              </View>
            </View>
            {formData.items.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.item}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.quantity}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.rate}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.amount}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.totals}>
            <Text>Sub Total: ₹{formData.subTotal}</Text>
            <Text>TCS (206C(1H)): ₹{formData.TCS}</Text>
            <Text>Total: ₹{formData.total}</Text>
            <Text>Total In Words: {formData.totalInWords}</Text>
          </View>
          <Text style={styles.signature}>Authorized Signature</Text>
        </Page>
      </Document>

    </>
  )
}

export default InvoicePDF
