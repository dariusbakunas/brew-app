import React, { ReactNode } from 'react';
import classNames from 'classnames';

type CellProps = {
  children: ReactNode,
  className?: string,
  nowrap?: boolean,
  shrink?: boolean,
};

function Cell(props: CellProps) {
  const {
    children, className, nowrap, shrink,
  } = props;

  const classes = classNames(
    className,
    { 'uk-table-shrink': shrink },
    { 'uk-text-nowrap': nowrap },
  );

  return (
    <td className={classes}>
      {children}
    </td>
  );
}

export default Cell;
