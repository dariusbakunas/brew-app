import classNames from "classnames";
import React from "react";

interface ICheckboxProps {
  checked: boolean;
  disabled?: boolean;
  label: string;
  name: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>, val: { name: string; value: boolean }) => void;
}

class Checkbox extends React.Component<ICheckboxProps> {
  public render() {
    const { label, name, checked, disabled } = this.props;

    const classes = classNames("uk-checkbox");

    const id = `${name}-input`;

    return (
      <label className="uk-form-label" htmlFor={id}>
        <input id={id} className={classes} name={name} type="checkbox" checked={checked} disabled={disabled} onChange={this.handleChange} /> {label}
      </label>
    );
  }

  private handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      const value = e.currentTarget.checked;
      const { name } = this.props;
      this.props.onChange(e, { name, value });
    }
  };
}

export default Checkbox;
