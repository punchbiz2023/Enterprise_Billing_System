import React from 'react';
import { Link } from 'react-router-dom';
import { CiBoxList,CiShoppingCart } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { BsGraphUp } from "react-icons/bs";
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <h2>Menu</h2>
      <ul>
        <li><Link to="/dashboard/items"><CiBoxList className='h-8 w-8'></CiBoxList></Link></li>
        <li><Link to="/dashboard/sales"><CiShoppingCart className='h-8 w-8'></CiShoppingCart></Link></li>
        <li><Link to="/dashboard/purchase"><IoBagOutline className='h-7 w-7 '></IoBagOutline></Link></li>
        <li><Link to="/dashboard/report"><BsGraphUp className='h-7 w-7'></BsGraphUp></Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
