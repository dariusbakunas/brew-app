import React, { ReactNode } from 'react';
import classNames from 'classnames';

type ColumnType = {
  children: ReactNode,
};

function Column(props: ColumnType) {
  const { children, ...rest } = props;

  const classes = classNames(
    'column',
  );

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export default Column;
