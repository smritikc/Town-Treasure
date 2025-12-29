import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const BuyerLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default BuyerLayout;
