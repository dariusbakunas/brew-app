import React, { ReactNode } from 'react';
import classNames from 'classnames';

type HeaderCellProps = {
  children: ReactNode,
  className?: string,
  nowrap?: boolean,
  shrink?: boolean,
};

function HeaderCell(props: HeaderCellProps) {
  const {
    children, className, nowrap, shrink,
  } = props;

  const classes = classNames(
    className,
    { 'uk-table-shrink': shrink },
    { 'uk-text-nowrap': nowrap },
  );

  return (
    <th className={classes}>
      {children}
    </th>
  );
}

export default HeaderCell;
