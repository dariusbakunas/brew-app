import React, { ReactNode } from 'react';

type HeaderProps = {
  children: ReactNode,
};

function Header({ children }: HeaderProps) {
  return (
    <thead>
      {children}
    </thead>
  );
}

export default Header;
