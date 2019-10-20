import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme>(theme => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  zFix: {
    zIndex: 10,
  },
}));

export interface IHeaderCell {
  id: string;
  align?: TableCellProps['align'];
  sortable?: boolean;
  label: string;
}

export type Order = 'asc' | 'desc';

interface IHeaderProps {
  cells: IHeaderCell[];
  onSort: (event: React.MouseEvent<unknown>, id: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  orderBy?: string;
  order: Order;
  selectedRows: number;
  totalRows: number;
}

const Header: React.FC<IHeaderProps> = ({
  cells,
  onSelectAllClick,
  onSort,
  orderBy,
  order,
  selectedRows,
  totalRows,
}) => {
  const classes = useStyles();
  const handleSortClick = (event: React.MouseEvent<unknown>, id: string) => {
    onSort(event, id);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" className={classes.zFix}>
          <Checkbox
            indeterminate={selectedRows > 0 && selectedRows < totalRows}
            checked={selectedRows === totalRows}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all' }}
          />
        </TableCell>
        {cells.map(cell => (
          <TableCell
            className={classes.zFix}
            key={cell.id}
            align={cell.align}
            sortDirection={orderBy === cell.id ? order : false}
          >
            {cell.sortable ? (
              <TableSortLabel
                active={orderBy === cell.id}
                direction={order}
                onClick={event => handleSortClick(event, cell.id)}
              >
                {cell.label}
                {orderBy === cell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              cell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default Header;
