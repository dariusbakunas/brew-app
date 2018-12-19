import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Header from './Header';
import HeaderCell from './HeaderCell';
import Row from './Row';
import Cell from './Cell';
import Body from './Body';

class Table extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    divider: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'large']),
    stripped: PropTypes.bool,
  };

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
