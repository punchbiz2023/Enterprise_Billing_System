import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo_Punchbiz.jpg';
import { CiSettings, CiBellOn, CiUser } from "react-icons/ci";

const Header = () => {
  const [selectedIcon, setSelectedIcon] = useState('');
  const navigate = useNavigate();

  return (
    <>
<<<<<<< HEAD
      <div className='h-[70px] w-full fixed bg-[#1E1E2E] top-0 left-0 flex justify-between items-center px-5'>
=======
      <div className='h-[70px] w-full fixed bg-[#5C5C7A] top-0 left-0 flex justify-between items-center px-5'>
>>>>>>> 6b8fea288c7d18bd47dc5b299c9c1bde588d62e9
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
<<<<<<< HEAD
            className={`text-white w-10 h-10 cursor-pointer ${selectedIcon === 'bell' ? 'text-[#000080]' : ''}`}
            onClick={() => setSelectedIcon('bell')} 
          />
          <CiSettings 
            className={`text-white w-10 h-10 cursor-pointer ${selectedIcon === 'settings' ? 'text-[#000080]' : ''}`}
            onClick={() => setSelectedIcon('settings')} 
          />
          <CiUser 
            className={`text-white w-10 h-10 cursor-pointer ${selectedIcon === 'user' ? 'text-[#000080]' : ''}`}
=======
            className={`w-10 h-10 cursor-pointer ${
              selectedIcon === 'bell' ? 'text-[#FFB703]' : 'text-[#F2E9E4]'}`}
            onClick={() => setSelectedIcon('bell')} 
          />
          <CiSettings 
            className={`w-10 h-10 cursor-pointer ${
              selectedIcon === 'settings' ? 'text-[#FFB703]' : 'text-[#F2E9E4]'}`}
            onClick={() => setSelectedIcon('settings')} 
          />
          <CiUser 
            className={`w-10 h-10 cursor-pointer ${
              selectedIcon === 'user' ? 'text-[#FFB703]' : 'text-[#F2E9E4]'}`}
>>>>>>> 6b8fea288c7d18bd47dc5b299c9c1bde588d62e9
            onClick={() => setSelectedIcon('user')} 
          />

        </div>
      </div>
    </>
  );
}

export default Header;
