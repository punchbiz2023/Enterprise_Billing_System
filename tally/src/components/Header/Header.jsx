import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo_Punchbiz.jpg';
import { CiSettings, CiBellOn, CiUser } from "react-icons/ci";

const Header = () => {
  const [selectedIcon, setSelectedIcon] = useState('');
  const navigate = useNavigate();

  return (
    <>
      <div className='h-[70px] w-full fixed bg-[#d86c55] top-0 left-0 flex justify-between items-center px-5'>
        <div className="relative w-32 h-8">
          <img 
            src={logo} 
            className="w-full h-full object-contain mix-blend-multiply hover:cursor-pointer" 
            alt="logo" 
            onClick={() => navigate('/dashboard')} 
          />
        </div>
        <div className='flex space-x-4'>
          <CiBellOn 
            className={`text-black w-10 h-10 cursor-pointer ${selectedIcon === 'bell' ? 'text-[#000080]' : ''}`}
            onClick={() => setSelectedIcon('bell')} 
          />
          <CiSettings 
            className={`text-black w-10 h-10 cursor-pointer ${selectedIcon === 'settings' ? 'text-[#000080]' : ''}`}
            onClick={() => setSelectedIcon('settings')} 
          />
          <CiUser 
            className={`text-black w-10 h-10 cursor-pointer ${selectedIcon === 'user' ? 'text-[#000080]' : ''}`}
            onClick={() => setSelectedIcon('user')} 
          />
        </div>
      </div>
    </>
  );
}

export default Header;
