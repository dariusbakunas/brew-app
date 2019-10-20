import React, { useState, useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { Maybe } from '../../types';
import Table from '@material-ui/core/Table';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Header, { IHeaderCell, Order } from './Header';
import { stableSort } from '../../utils/stableSort';
import TableToolbar from './Toolbar';

type ValueGetter<T extends {}> = (item: T) => string;

export interface IDataTableProps<T extends { id: string }> {
  label: string;
  initialSort?: string;
  loading: boolean;
  data: Maybe<T[]>;
  columns: Array<{
    id: string;
    numeric?: boolean;
    header: string;
    sortable?: boolean;
    value: keyof T | ValueGetter<T>;
  }>;
}

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  tableWrapper: {
    maxHeight: 'calc(100vh - 200px)',
    overflow: 'auto',
  },
}));

interface IRowCell {
  id: string;
  align?: TableCellProps['align'];
  value: string;
}

interface IRow {
  id: string;
  cells: IRowCell[];
}

const desc = (a: string | number, b: string | number) => {
  if (b < a) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
  return 0;
};

const DataTable = <T extends { id: string }>({
  data,
  label,
  loading,
  columns,
  initialSort,
}: IDataTableProps<T>) => {
  const classes = useStyles();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(initialSort || 'id');

  const rows = useMemo<IRow[]>(() => {
    if (!data) {
      return [];
    }

    const unorderedRows = data.map((row: T) => {
      return {
        id: row.id,
        cells: columns.map<IRowCell>(column => ({
          id: column.id,
          align: column.numeric ? 'right' : 'left',
          value: typeof column.value === 'function' ? column.value(row) : `${row[column.value]}`,
        })),
      };
    });

    const sortIndex = columns.findIndex(col => col.id === orderBy);

    if (sortIndex !== -1) {
      return stableSort<IRow>(unorderedRows, (a, b) => {
        const valueA = a.cells[sortIndex].value;
        const valueB = b.cells[sortIndex].value;
        return order === 'desc' ? desc(valueA, valueB) : -desc(valueA, valueB);
      });
    }

    return unorderedRows;
  }, [data, columns, order, orderBy]);

  const isSelected = (id: string) => selected.has(id);

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const newSelection = new Set(selected);

    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }

    setSelected(newSelection);
  };

  const headerCells: IHeaderCell[] = columns.map(column => ({
    id: column.id,
    label: column.header,
    align: column.numeric ? 'right' : 'left',
    sortable: column.sortable,
  }));

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelection = rows.reduce<Set<string>>((acc, row) => {
        acc.add(row.id);
        return acc;
      }, new Set());

      setSelected(newSelection);
    } else {
      setSelected(new Set());
    }
  };

  const handleSort = (event: React.MouseEvent<unknown>, id: string) => {
    const isDesc = orderBy === id && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(id);
  };

  return (
    <Paper className={classes.root}>
      <TableToolbar numSelected={selected.size} label={label} />
      <div className={classes.tableWrapper}>
        <Table stickyHeader className={classes.table} aria-label="simple table">
          <Header
            cells={headerCells}
            onSort={handleSort}
            onSelectAllClick={handleSelectAllClick}
            order={order}
            orderBy={orderBy}
            selectedRows={selected.size}
            totalRows={rows.length}
          />
          <TableBody>
            {rows.map(row => (
              <TableRow hover key={row.id} onClick={event => handleClick(event, row.id)}>
                <TableCell padding="checkbox">
                  <Checkbox checked={isSelected(row.id)} />
                </TableCell>
                {row.cells.map(cell => (
                  <TableCell key={cell.id} align={cell.align}>
                    {cell.value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
};

export default DataTable;
