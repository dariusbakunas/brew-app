import classNames from 'classnames';
import * as React from 'react';
import Icon from '../Icon';

export type InputChangeHandlerType = (
  e: React.FormEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>,
  val: { name: string, value: string | string[] | number | boolean },
) => void;

interface InputProps {
  disabled?: boolean;
  error?: string;
  label?: string;
  min?: number;
  max?: number;
  name: string;
  icon?: string;
  iconWidth?: string;
  onChange?: InputChangeHandlerType;
  required?: boolean;
  step?: number;
  type?: 'text' | 'number';
  value?: string | number;
  width?: 'large' | 'medium' | 'small' | 'xsmall';
}

class Input extends React.Component<InputProps> {
  public static defaultProps: Partial<InputProps> = {
    iconWidth: '20px',
    step: 1,
    type: 'text',
  };

  public handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      name, onChange, step, type,
    } = this.props;
    const { value } = e.currentTarget;

    if (onChange) {
      if (value !== '' && type === 'number' && typeof value === 'string') {
        const num = step === 1 ? parseInt(value, 10) :
          parseFloat(value);
        onChange(e, { name, value: num });
      } else {
        onChange(e, { name, value });
      }
    }
  }

  public render() {
    const {
      disabled, error, label, min, max, icon, iconWidth, name, required, step, type, value, width,
    } = this.props;

    const classes = classNames(
      'uk-input',
      { 'uk-form-danger': error },
      { [`uk-form-width-${width}`]: width },
    );

    const id = `${name}-input`;

    const inputElement = (
      <input
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
      />);

    return (
      <React.Fragment>
        {label && <label className='uk-form-label' htmlFor={id}>{label}</label>}
        { icon ? <div className='uk-inline'>
          <span className='uk-form-icon uk-form-icon-flip uk-icon'>
            <Icon icon={icon} width={iconWidth}/>
          </span>
          {inputElement}
        </div> : inputElement}
        {error && <span className='uk-text-danger'>{error}</span>}
      </React.Fragment>
    );
  }
}

export default Input;
