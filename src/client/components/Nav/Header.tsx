import React from 'react';

function Header(props: { label: string }) {
  const { label } = props;

  return (
    <li className='uk-nav-header'>{label}</li>
  );
}

export default Header;
