import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function Fieldset(props) {
  const { children, layout, legend } = props;

  const classes = classNames(
    'uk-fieldset',
    { [`uk-form-${layout}`]: layout },
  );

  return (
    <fieldset className={classes}>
      {
        legend &&
        <legend className="uk-legend">{legend}</legend>
      }
      {children}
    </fieldset>
  );
}

Fieldset.propTypes = {
  children: PropTypes.node,
  legend: PropTypes.string,
  layout: PropTypes.oneOf(['stacked', 'horizontal']),
};

export default Fieldset;
