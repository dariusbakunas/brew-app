import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import getUnhandledProps from '../../utils/getUnhandledProps';

class Input extends React.Component {
  handleChange = (e) => {
    if (this.props.onChange) {
      const value = e.target.checked;
      const { name } = this.props;
      this.props.onChange(e, { name, value });
    }
  };

  render() {
    const { label, name } = this.props;

    const rest = getUnhandledProps(Input, this.props);

    const classes = classNames(
      'uk-checkbox',
    );

    const id = `${name}-input`;

    return (
      <div className='uk-margin uk-form-controls'>
        <label className='uk-form-label' htmlFor={id}>
          <input id={id} className={classes} name={name} type='checkbox' {...rest} onChange={this.handleChange}/>
          {' '}{label}
        </label>
      </div>
    );
  }
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

export default Input;
