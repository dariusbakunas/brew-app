import React from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ children, selector }) => {
  const element = typeof document !== 'undefined' ? document.querySelector(selector) : null;

  if (element === null) {
    return null;
  }

  return ReactDOM.createPortal(children, element);
};

export default Portal;
