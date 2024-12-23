import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../component/Context';

const ProtectedRoute = ({ children }) => {
  const { user,authToken } = useContext(UserContext);
  console.log(user)


  return authToken ? <Outlet/> : <Navigate to="/" />;
};

export default ProtectedRoute;
