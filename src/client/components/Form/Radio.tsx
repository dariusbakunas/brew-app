import React from 'react';
import classNames from 'classnames';

type RadioProps = {
  checked: boolean,
  label: string,
  name: string,
  onChange: (
    e: React.FormEvent<HTMLInputElement>, val: { name: string, value: string | string[] | number },
  ) => void,
  value: string,
};

class Radio extends React.Component<RadioProps> {
  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      const { value } = e.currentTarget;
      const { name } = this.props;
      this.props.onChange(e, { name, value });
    }
  };

  render() {
    const {
      checked, label, name, value,
    } = this.props;

    const classes = classNames(
      'uk-radio',
    );

    const id = `${name}-input`;

    return (
      <label className='uk-form-label' htmlFor={id}>
        <input id={id} checked={checked} className={classes} name={name} type='radio' value={value} onChange={this.handleChange}/>
        {' '}{label}
      </label>
    );
  }
}

export default Radio;
