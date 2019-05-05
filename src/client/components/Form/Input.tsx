import classNames from 'classnames';
import debounce from 'lodash.debounce';
import React from 'react';
import { randomId } from '../../utils/random';
import Icon from '../Icon';

export type InputChangeHandlerType = (
  e: React.FormEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>,
  val: { name: string, value: string | string[] | number | boolean },
) => void;

interface IInputProps {
  debounced: boolean;
  disabled?: boolean;
  error?: string;
  id?: string;
  label?: string;
  min?: number;
  max?: number;
  name: string;
  icon?: string;
  iconWidth?: string;
  onBlur?: () => void;
  onChange?: InputChangeHandlerType;
  required?: boolean;
  step?: number;
  style?: object;
  type?: 'text' | 'number';
  value?: string | number;
  width?: 'large' | 'medium' | 'small' | 'xsmall';
}

class Input extends React.Component<IInputProps> {
  public static defaultProps: Partial<IInputProps> = {
    iconWidth: '20px',
    step: 1,
    type: 'text',
  };

  private inputId: string;

  constructor(props: IInputProps) {
    super(props);

    this.inputId = randomId();

    if (props.debounced) {
      this.changeCallback = debounce(this.changeCallback, 300);
    }
  }

  public render() {
    const {
      disabled, error, id, label, min, max, icon, iconWidth,
      name, required, step, type, value, width, style,
    } = this.props;

    const classes = classNames(
      'uk-input',
      { 'uk-form-danger': error },
      { [`uk-form-width-${width}`]: width },
    );

    const inputElement = (
      <input
        id={id || this.inputId}
        className={classes}
        max={max}
        min={min}
        name={name}
        onChange={this.handleChange}
        step={type === 'number' ? step : null}
        onBlur={this.props.onBlur}
        type={type}
        value={value}
        disabled={disabled}
        required={required}
        style={style}
      />);

    return (
      <React.Fragment>
        {label && <label className='uk-form-label' htmlFor={this.inputId}>{label}</label>}
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

  private changeCallback: InputChangeHandlerType = (e, value) => {
    if (this.props.onChange) {
      this.props.onChange(e, value);
    }
  }

  private handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      name, onChange, step, type,
    } = this.props;
    const { value } = e.currentTarget;

    if (onChange) {
      if (value !== '' && type === 'number' && typeof value === 'string') {
        const num = step === 1 ? parseInt(value, 10) :
          parseFloat(value);
        this.changeCallback(e, { name, value: num });
      } else {
        this.changeCallback(e, { name, value });
      }
    }
  }
}

export default Input;
