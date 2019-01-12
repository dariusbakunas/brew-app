import React, { ReactNode } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import getUnhandledProps from '../../utils/getUnhandledProps';

export type InputChangeHandlerType = (
  e: React.FormEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>,
  val: { name: string, value: string | number | boolean }
) => void;

type InputProps = {
  disabled?: boolean,
  error?: string,
  label?: string,
  min?: number,
  max?: number,
  name: string,
  icon?: string,
  iconWidth?: string,
  onChange: InputChangeHandlerType,
  required?: boolean,
  step?: number,
  type: string | number,
  value: string | number,
  width: 'large' | 'medium' | 'small' | 'xsmall',
};

class Input extends React.Component<InputProps> {
  public static defaultProps: Partial<InputProps> = {
    step: 1,
    type: 'text',
    iconWidth: '20px',
  };

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      name, onChange, step, type,
    } = this.props;
    const { value } = e.currentTarget;

    if (onChange) {
      if (value !== '' && type === 'number') {
        const num = step === 1 ? parseInt(value, 10) :
          parseFloat(value);
        onChange(e, { name, value: num });
      } else {
        onChange(e, { name, value });
      }
    }
  };

  withIcon = (children: ReactNode, icon: string, iconWidth: string) => {
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
      disabled, error, label, min, max, icon, iconWidth, name, required, step, type, value, width,
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
      max={max}
      min={min}
      name={name}
      onChange={this.handleChange}
      step={type === 'number' ? step : null}
      type={type}
      value={value}
      disabled={disabled}
      required={required}
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

export default Input;
