import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function Fieldset(props) {
  const { children, legend } = props;

  const classes = classNames(
    'uk-fieldset',
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
};

export default Fieldset;
