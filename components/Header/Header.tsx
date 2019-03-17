import React, { ReactNode } from 'react';
import classNames from 'classnames';

type HeaderProps = {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5',
  children: ReactNode,
  className?: string,
  textAlign?: 'left' | 'center' | 'right' | 'justify'
};

function Header(props: HeaderProps) {
  const {
    as: Element,
    children,
    className,
    textAlign,
  } = props;

  const classes = classNames(
    { [`uk-text-${textAlign}`]: textAlign },
    className,
  );

  return (
    <Element className={classes}>{children}</Element>
  );
}

Header.defaultProps = {
  as: 'h1',
};

export default Header;
