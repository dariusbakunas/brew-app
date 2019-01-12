import React, { ReactNode } from 'react';
import classNames from 'classnames';

type TabsProps = {
  align?: 'left' | 'center' | 'right',
  children: ReactNode,
  className?: string,
};

function Tabs(props: TabsProps) {
  const { align, className, children } = props;

  const classes = classNames(
    'uk-tab',
    { [`uk-flex-${align}`]: align },
    className,
  );

  return (
    <ul className={classes}>
      {children}
    </ul>
  );
}

export default Tabs;
