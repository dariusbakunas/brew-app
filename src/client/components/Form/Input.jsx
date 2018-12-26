import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import { ICONS } from '../../../contants';
import getUnhandledProps from '../../utils/getUnhandledProps';

class Input extends React.Component {
  handleChange = (e) => {
    if (this.props.onChange) {
      const { value } = e.target;
      const { name } = this.props;
      this.props.onChange(e, { name, value });
    }
  };

  withIcon = (children, icon, iconWidth) => {
    if (icon) {
      return (
        <div className='uk-inline'>
          <span className="uk-form-icon uk-form-icon-flip uk-icon">
            <Icon icon={icon} width={iconWidth}/>
          </span>
          {children}
        </div>
      );
    }

    return children;
  };

  render() {
    const {
      error, label, icon, iconWidth, name, type, width,
    } = this.props;

    const rest = getUnhandledProps(Input, this.props);

    const classes = classNames(
      'uk-input',
      { 'uk-form-danger': error },
      { [`uk-form-width-${width}`]: width },
    );

    const id = `${name}-input`;

    const inputElement = this.withIcon(<input
      id={id}
      className={classes}
      name={name}
      onChange={this.handleChange}
      type={type}
      {...rest}
    />, icon, iconWidth);

    return (
      <React.Fragment>
        { label && <label className='uk-form-label' htmlFor={id}>{label}</label> }
        {inputElement}
        { error && <span className='uk-text-danger'>{error}</span> }
      </React.Fragment>
    );
  }
}

Input.defaultProps = {
  type: 'text',
  iconWidth: '20px',
};

Input.propTypes = {
  error: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  icon: PropTypes.oneOf(ICONS),
  iconWidth: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['text', 'number']),
  width: PropTypes.oneOf(['large', 'medium', 'small', 'xsmall']),
};

export default Input;
