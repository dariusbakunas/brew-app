import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import GridColumn from './GridColumn';
import getUnhandledProps from '../../utils/getUnhandledProps';
import { TEXT_ALIGNMENTS, VERTICAL_ALIGNMENTS } from '../../../contants';

function Grid(props) {
  const {
    centered, children, textAlign, verticalAlign,
  } = props;

  const classes = classNames(
    { centered },
    { [textAlign === 'justified' ? 'justified' : `${textAlign} aligned`]: textAlign },
    { [`${verticalAlign} aligned`]: verticalAlign },
    'grid',
  );

  const rest = getUnhandledProps(GridColumn, props);

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

Grid.Column = GridColumn;

Grid.propTypes = {
  centered: PropTypes.bool,
  children: PropTypes.node,
  textAlign: PropTypes.oneOf(TEXT_ALIGNMENTS),
  verticalAlign: PropTypes.oneOf(VERTICAL_ALIGNMENTS),
};

export default Grid;
