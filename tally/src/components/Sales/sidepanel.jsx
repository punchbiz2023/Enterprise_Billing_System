import React from 'react';
import { Link } from 'react-router-dom';

const SidePanel = () => {
  return (
    <div className="fixed top-[70px] left-[100px] h-[calc(100vh-60px)] w-[150px] bg-[#4F4F4F] p-5 shadow-md overflow-y-auto">
      <ul className="space-y-4">
        <li>
          <Link
            to="/dashboard/sales/customers"
            className="block p-2 text-white transition-colors duration-300 ease-in-out rounded hover:text-ivory-600"
          >
            Customers
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/invoice"
            className="block p-2 text-white transition-colors duration-300 ease-in-out rounded hover:text-ivory-600"
          >
            Invoice
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/order"
            className="block p-2 text-white transition-colors duration-300 ease-in-out rounded hover:text-ivory-600"
          >
            Order
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/estimate"
            className="block p-2 text-white transition-colors duration-300 ease-in-out rounded hover:text-ivory-600"
          >
            Estimate
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/payment-received"
            className="block p-2 text-white transition-colors duration-300 ease-in-out rounded hover:text-ivory-600"
          >
            Payment Received
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidePanel;
