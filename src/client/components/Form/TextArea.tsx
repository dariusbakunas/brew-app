import React from 'react';
import classNames from 'classnames';
import getUnhandledProps from '../../utils/getUnhandledProps';

type TextAreaProps = {
  error?: string,
  label?: string,
  name: string,
  onChange: (
    e: React.FormEvent<HTMLInputElement>, val: { name: string, value: string | number }
  ) => void,
  resize?: boolean,
  rows: number,
  width: 'large' | 'medium' | 'small' | 'xsmall'
};

class TextArea extends React.Component<TextAreaProps> {
  static defaultProps: Partial<TextAreaProps> = {
    resize: false,
    rows: 5,
  };

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      const { value } = e.currentTarget;
      const { name } = this.props;
      this.props.onChange(e, { name, value });
    }
  };

  render() {
    const {
      error, label, name, resize, rows, width,
    } = this.props;

    const rest = getUnhandledProps(TextArea, this.props);

    const classes = classNames(
      'uk-textarea',
      { noresize: !resize },
      { 'uk-form-danger': error },
      { [`uk-form-width-${width}`]: width },
    );

    const id = `${name}-input`;

    return (
      <div className='uk-margin uk-form-controls'>
        {
          label &&
          <label className='uk-form-label' htmlFor={id}>{label}</label>
        }
        <textarea
          id={id}
          className={classes}
          name={name}
          onChange={this.handleChange}
          rows={rows}
          {...rest}
        />
        {
          error &&
          <span className='uk-text-danger'>{error}</span>
        }
      </div>
    );
  }
}

export default TextArea;
