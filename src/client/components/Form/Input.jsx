import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import getUnhandledProps from '../../utils/getUnhandledProps';

class Input extends React.Component {
  handleChange = (e) => {
    if (this.props.onChange) {
      const { value } = e.target;
      const { name } = this.props;
      this.props.onChange(e, { name, value });
    }
  };

  render() {
    const {
      error, label, name, width,
    } = this.props;

    const rest = getUnhandledProps(Input, this.props);

    const classes = classNames(
      'uk-input',
      { 'uk-form-danger': error },
      { [`uk-form-width-${width}`]: width },
    );

    const id = `${name}-input`;

    return (
      <div className='uk-margin uk-form-controls'>
        {
          label &&
          <label className='uk-form-label' htmlFor={id}>{label}</label>
        }
        <input id={id} className={classes} name={name} {...rest} onChange={this.handleChange}/>
        {
          error &&
          <span className='uk-text-danger'>{error}</span>
        }
      </div>
    );
  }
}

Input.propTypes = {
  error: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  width: PropTypes.oneOf(['large', 'medium', 'small', 'xsmall']),
};

export default Input;
