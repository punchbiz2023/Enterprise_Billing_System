import React from 'react';
import { Link } from 'react-router-dom';
import { CiBoxList, CiShoppingCart,CiBag1 } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { BsGraphUp } from "react-icons/bs";
import { MdInventory } from 'react-icons/md';
import { FaUserTie, FaUserCheck } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className='inner-div bg-[#5C5C7A]'>
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
          <li className="">
            <Link to="/dashboard/purchase" className='flex flex-col items-center justify-center'>
              <IoBagOutline className='text-white ml-1 h-7 w-7' />
              <span className="text-white text-xs mt-1">Purchase</span>
            </Link>
          </li>
          <li className="flex flex-col items-center mb-4">
              <Link to="/dashboard/inventory">
                  <MdInventory className='text-white ml-1 h-7 w-7' />
                  <span className="text-white text-xs mt-1">Inventory</span>
              </Link>
          </li>
          <li className="flex flex-col items-center mb-4">
            <Link to="/dashboard/journal">
            <FaUserTie className='text-white ml-1 h-7 w-7' />

              <span className="text-white text-xs mt-1">Accountant</span>
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
