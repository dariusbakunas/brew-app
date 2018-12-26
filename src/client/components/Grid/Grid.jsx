import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Column from './Column';
import { TEXT_ALIGNMENTS, VERTICAL_ALIGNMENTS } from '../../../contants';

function Grid(props) {
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

Grid.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  divider: PropTypes.bool,
  gutter: PropTypes.oneOf(['small', 'medium', 'large', 'collapse']),
  textAlign: PropTypes.oneOf(TEXT_ALIGNMENTS),
};

export default Grid;
