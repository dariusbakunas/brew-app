import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class Radio extends React.Component {
  handleChange = (e) => {
    if (this.props.onChange) {
      const { value } = e.target;
      const { name } = this.props;
      this.props.onChange(e, { name, value });
    }
  };

  render() {
    const { label, name, ...rest } = this.props;

    const classes = classNames(
      'uk-radio',
    );

    const id = `${name}-input`;

    return (
      <label className='uk-form-label' htmlFor={id}>
        <input id={id} className={classes} name={name} type='radio' {...rest} onChange={this.handleChange}/>
        {' '}{label}
      </label>
    );
  }
}

Radio.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

export default Radio;
