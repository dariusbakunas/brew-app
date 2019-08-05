import classNames from 'classnames';
import React from 'react';

interface ISelectProps {
  error?: string;
  label?: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>, val: { name: string; value: string }) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  value: string;
  width?: 'large' | 'medium' | 'small' | 'xsmall';
}

class Select extends React.Component<ISelectProps> {
  public render() {
    const { error, label, name, options, value, width } = this.props;

    const classes = classNames('uk-select', { 'uk-form-danger': error }, { [`uk-form-width-${width}`]: width });

    const id = `${name}-input`;

    const selectElement = (
      <select id={id} className={classes} onChange={this.handleChange} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );

    return (
      <React.Fragment>
        {label && (
          <label className="uk-form-label" htmlFor={id}>
            {label}
          </label>
        )}
        {selectElement}
        {error && <span className="uk-text-danger">{error}</span>}
      </React.Fragment>
    );
  }

  private handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, onChange } = this.props;
    const { value } = e.currentTarget;

    if (onChange) {
      onChange(e, { name, value });
    }
  };
}

export default Select;
