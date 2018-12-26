import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import getUnhandledProps from '../../utils/getUnhandledProps';

class Select extends React.Component {
  handleChange = (e) => {
    const {
      name, onChange,
    } = this.props;
    const { value } = e.target;

    if (onChange) {
      onChange(e, { name, value });
    }
  };

  render() {
    const {
      error, label, name, options, width,
    } = this.props;

    const rest = getUnhandledProps(Select, this.props);

    const classes = classNames(
      'uk-select',
      { 'uk-form-danger': error },
      { [`uk-form-width-${width}`]: width },
    );

    const id = `${name}-input`;

    const selectElement = (
      <select id={id} className={classes} onBlur={this.handleChange} {...rest}>
        {
          options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))
        }
      </select>
    );

    return (
      <React.Fragment>
        { label && <label className='uk-form-label' htmlFor={id}>{label}</label> }
        {selectElement}
        { error && <span className='uk-text-danger'>{error}</span> }
      </React.Fragment>
    );
  }
}

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
  width: PropTypes.oneOf(['large', 'medium', 'small', 'xsmall']),
};

export default Select;
