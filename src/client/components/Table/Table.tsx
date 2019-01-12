import React, { ReactNode } from 'react';
import classNames from 'classnames';
import Header from './Header';
import HeaderCell from './HeaderCell';
import Row from './Row';
import Cell from './Cell';
import Body from './Body';

type TableProps = {
  children: ReactNode,
  className?: string,
  divider?: boolean,
  size: 'small' | 'large',
  stripped?: boolean,
};

class Table extends React.Component<TableProps> {
  static Header = Header;

  static HeaderCell = HeaderCell;

  static Row = Row;

  static Cell = Cell;

  static Body = Body;

  render() {
    const {
      children, className, size, stripped,
    } = this.props;

    const classes = classNames(
      'uk-table',
      { 'uk-table-divider': this.props.divider },
      { [`uk-table-${size}`]: size },
      { 'uk-table-striped': stripped },
      className,
    );

    return (
      <table className={classes}>
        {children}
      </table>
    );
  }
}

export default Table;
