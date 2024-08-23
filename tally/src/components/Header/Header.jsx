import React from 'react'
import logo from '../../assets/Logo_Punchbiz.jpg'
import { CiSettings, CiBellOn, CiUser } from "react-icons/ci";

const Header = () => {
  return (
    <>
      <div className='h-[70px] w-full fixed bg-blue-300 top-0 left-0 flex justify-between items-center px-5'>
        <div className="relative w-32 h-8">
          <img src={logo} className="w-full h-full object-contain mix-blend-multiply" alt="logo" />
        </div>
        <div className='flex space-x-4'>
          <CiBellOn className='w-10 h-10' />
          <CiSettings className='w-10 h-10' />
          <CiUser className='w-10 h-10' />
        </div>
      </div>
    </>
  )
}

export default Header
