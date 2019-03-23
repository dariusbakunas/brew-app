import React, { useState } from 'react';
import { Navbar } from '../components';

const Main = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar toggleTarget='side-menu'/>
      <div className='main-container'>
        {children}
      </div>
    </React.Fragment>
  );
};

export default Main;
