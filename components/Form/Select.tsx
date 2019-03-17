import * as React from 'react';
import classNames from 'classnames';
import getUnhandledProps from '../../src/client/utils/getUnhandledProps';

type SelectProps = {
  error?: string,
  label?: string,
  name: string,
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>, val: { name: string, value: string | number }
  ) => void,
  options: {
    value: string,
    label: string,
  }[],
  value: string,
  width?: 'large' | 'medium' | 'small' | 'xsmall'
};

class Select extends React.Component<SelectProps> {
  handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      name, onChange,
    } = this.props;
    const { value } = e.currentTarget;

    if (onChange) {
      onChange(e, { name, value });
    }
  };

  render() {
    const {
      error, label, name, options, value, width,
    } = this.props;

    const classes = classNames(
      'uk-select',
      { 'uk-form-danger': error },
      { [`uk-form-width-${width}`]: width },
    );

    const id = `${name}-input`;

    const selectElement = (
      <select id={id} className={classes} onChange={this.handleChange} value={value}>
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

export default Select;