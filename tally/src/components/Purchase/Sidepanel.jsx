import React from 'react';
import { Link } from 'react-router-dom';

const SidePanel = () => {
  return (
    <div className="fixed top-[70px] left-[100px] h-[calc(100vh-60px)] w-[150px] bg-[#4F4F4F] p-5 shadow-md overflow-y-auto">
      <ul className="space-y-4">
        <li>
          <Link
            to="/dashboard/purchase/vendors"
            className="block p-2 text-white transition-colors duration-300 ease-in-out rounded hover:text-ivory-600"
          >
            Vendors
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/purchase/expense"
            className="block p-2 text-white transition-colors duration-300 ease-in-out rounded hover:text-ivory-600"
          >
            Expenses
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/purchase/order"
            className="block p-2 text-white transition-colors duration-300 ease-in-out rounded hover:text-ivory-600"
          >
            Order
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/purchase/bill"
            className="block p-2 text-white transition-colors duration-300 ease-in-out rounded hover:text-ivory-600"
          >
            Bills
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/purchase/payment-done"
            className="block p-2 text-white transition-colors duration-300 ease-in-out rounded hover:text-ivory-600"
          >
            Payment Done
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidePanel;
