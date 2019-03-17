import React, { ReactNode } from 'react';
import classNames from 'classnames';

type ContainerProps = {
  children: ReactNode,
  className?: string,
  size?: 'xsmall' | 'small' | 'large' | 'expand'
};

function Container(props: ContainerProps) {
  const { children, className, size } = props;

  const classes = classNames(
    'uk-container',
    { [`uk-container-${size}`]: size },
    className,
  );

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

export default Container;
