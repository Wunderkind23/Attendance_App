import React, { useContext, useState } from 'react';
import { IoIosNotificationsOutline } from "react-icons/io";
import attendance1 from '../asset/attendance1.avif'; // Default image if no profile picture is available
import { UserContext } from './Context';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const MainPageNav1 = () => {

  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to login page
  };


  return (
    <div className='h-[10vh] border flex items-center justify-between px-4'>
      <div className='flex items-center  gap-2 h-full'>
        <div className='w-[40px] h-[40px]'>
          <img
            className='w-full h-full rounded-full object-cover cursor-pointer'
            src={user.picture || attendance1} // Use the profile picture from context
            alt='Profile'
          />
        </div>
        <div>
          <h4>{user.name || 'No Name'}</h4>
          <p>Welcome back</p>
        </div>
        
      </div>

      <span onClick={handleLogout} className=' border border-red-500 px-4 py-1 w-[100px] rounded-md cursor-pointer' >
        <Link to='/'>
        log out
        </Link>
      </span>
    
    </div>
  );
};

export default MainPageNav1;
