import React from 'react';
import { Link } from 'react-router-dom';
import { CiBoxList, CiShoppingCart,CiBag1 } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { BsGraphUp } from "react-icons/bs";
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className='inner-div bg-[#2F4F4F]'>
        <ul className="flex flex-col items-center">
          <li className="flex flex-col items-center mb-4">
            <Link to="/dashboard">
              <CiBoxList className='text-white ml-1 h-8 w-8' />
              <span className="text-white text-xs mt-1">Dashboard</span>
            </Link>
          </li>
          <li className="flex flex-col items-center mb-4">
            <Link to="/dashboard/items">
              <CiBag1 className='text-white mr-3 h-8 w-8' />
              <span className="text-white text-xs mt-1">Items</span>
            </Link>
          </li>
          
          <li className="flex flex-col items-center mb-4">
            <Link to="/dashboard/sales">
              <CiShoppingCart className='text-white mr-3 h-8 w-8' />
              <span className="text-white text-xs mt-1">Sales</span>
            </Link>
          </li>
          <li className="flex flex-col items-center mb-4">
            <Link to="/dashboard/purchase">
              <IoBagOutline className='text-white ml-1 h-7 w-7' />
              <span className="text-white text-xs mt-1">Purchase</span>
            </Link>
          </li>
          <li className="flex flex-col items-center mb-4">
            <Link to="/dashboard/report">
              <BsGraphUp className='text-white ml-1 h-7 w-7' />
              <span className="text-white text-xs mt-1">Reports</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
