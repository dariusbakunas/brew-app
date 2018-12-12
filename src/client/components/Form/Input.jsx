import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import getUnhandledProps from '../../utils/getUnhandledProps';

class Input extends React.Component {
  handleChange = (e) => {
    if (this.props.onChange) {
      const value = e.target.value;
      const name = this.props.name;
      this.props.onChange(e, { name, value });
    }
  };

  render() {
    const { error, name, width } = this.props;

    const rest = getUnhandledProps(Input, this.props);

    const classes = classNames(
      'uk-input',
      { 'uk-form-danger': error },
      { [`uk-form-width-${width}`]: width },
    );

    return (
      <div className="uk-margin uk-form-controls">
        <input className={classes} name={name} {...rest} onChange={this.handleChange}/>
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
  name: PropTypes.string,
  onChange: PropTypes.func,
  width: PropTypes.oneOf(['large', 'medium', 'small', 'xsmall']),
};

export default Input;
