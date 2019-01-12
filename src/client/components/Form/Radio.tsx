import React from 'react';
import classNames from 'classnames';

type RadioProps = {
  label: string,
  name: string,
  onChange: (
    e: React.FormEvent<HTMLInputElement>, val: { name: string, value: string | number }
  ) => void
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

export default Radio;
