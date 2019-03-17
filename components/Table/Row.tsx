import React, { ReactNode } from 'react';

type RowProps = {
  children: ReactNode,
};

function Row(props: RowProps) {
  return (
    <tr>
      {props.children}
    </tr>
  );
}

export default Row;
