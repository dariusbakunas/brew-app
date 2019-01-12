import React, { ReactNode } from 'react';
import classNames from 'classnames';
import Column from './Column';

type GridProps = {
  children: ReactNode,
  className?: string,
  divider?: boolean,
  gutter?: 'small' | 'medium' | 'large' | 'collapse',
  textAlign: 'left' | 'center' | 'right' | 'justify'
};

function Grid(props: GridProps) {
  const {
    children,
    className,
    divider,
    gutter,
    textAlign,
    ...rest
  } = props;

  const classes = classNames(
    className,
    { 'uk-grid-divider': divider },
    { [`uk-grid-${gutter}`]: gutter },
    { [`uk-text-${textAlign}`]: textAlign },
  );

  return (
    <div className={classes} {...rest} data-uk-grid>
      {children}
    </div>
  );
}

Grid.Column = Column;

export default Grid;
