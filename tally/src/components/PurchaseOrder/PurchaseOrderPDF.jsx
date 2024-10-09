// // PurchaseOrderPDF.jsx
// import React from 'react';
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//     page: {
//         flexDirection: 'column',
//         padding: 20,
//         fontSize: 12,
//         fontFamily: 'Helvetica',
//     },
//     section: {
//         marginBottom: 10,
//     },
//     table: {
//         display: 'table',
//         width: 'auto',
//         margin: '10px 0',
//     },
//     tableRow: {
//         margin: 'auto',
//         flexDirection: 'row',
//     },
//     tableCol: {
//         width: '25%',
//         border: '1px solid #000',
//         padding: 5,
//     },
//     title: {
//         fontSize: 18,
//         marginBottom: 20,
//         textAlign: 'center',
//     },
// });

// const PurchaseOrderPDF = ({ orderData }) => (
//     <Document>
//         <Page size="A4" style={styles.page}>
//             <Text style={styles.title}>Purchase Order</Text>
//             <View style={styles.section}>
//                 <Text><strong>Vendor:</strong> {orderData.name}</Text>
//                 <Text><strong>Delivery Type:</strong> {orderData.delivery}</Text>
//                 <Text><strong>Order Number:</strong> {orderData.orderno}</Text>
//                 <Text><strong>Reference:</strong> {orderData.ref}</Text>
//                 <Text><strong>Date:</strong> {orderData.date}</Text>
//                 <Text><strong>Expected Delivery Date:</strong> {orderData.deliverydate}</Text>
//                 <Text><strong>Payment Terms:</strong> {orderData.terms}</Text>
//                 <Text><strong>Mode of Shipment:</strong> {orderData.modeofshipment}</Text>
//             </View>
//             <View style={styles.section}>
//                 <Text style={{ fontWeight: 'bold' }}>Item Details:</Text>
//                 <View style={styles.table}>
//                     <View style={styles.tableRow}>
//                         <View style={styles.tableCol}><Text>Item</Text></View>
//                         <View style={styles.tableCol}><Text>Quantity</Text></View>
//                         <View style={styles.tableCol}><Text>Rate</Text></View>
//                         <View style={styles.tableCol}><Text>Amount</Text></View>
//                     </View>
//                     {orderData.itemdetails.map((item, index) => (
//                         <View style={styles.tableRow} key={index}>
//                             <View style={styles.tableCol}><Text>{item.account}</Text></View>
//                             <View style={styles.tableCol}><Text>{item.quantity}</Text></View>
//                             <View style={styles.tableCol}><Text>{item.rate}</Text></View>
//                             <View style={styles.tableCol}><Text>{(item.rate * item.quantity).toFixed(2)}</Text></View>
//                         </View>
//                     ))}
//                 </View>
//                 <Text><strong>Subtotal:</strong> ₹ {orderData.total.toFixed(2)}</Text>
//                 <Text><strong>GST:</strong> {orderData.gst} %</Text>
//                 <Text><strong>GST Amount:</strong> ₹ {(orderData.total * orderData.gst / 100).toFixed(2)}</Text>
//                 <Text><strong>Grand Total:</strong> ₹ {orderData.total.toFixed(2)}</Text>
//             </View>
//         </Page>
//     </Document>
// );

// export default PurchaseOrderPDF;
