import React from 'react';
import classNames from 'classnames';

type TextAreaProps = {
  disabled?: boolean,
  error?: string,
  label?: string,
  name: string,
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>, val: { name: string, value: string | number }
  ) => void,
  resize?: boolean,
  rows: number,
  value: string,
  width: 'large' | 'medium' | 'small' | 'xsmall'
};

class TextArea extends React.Component<TextAreaProps> {
  static defaultProps: Partial<TextAreaProps> = {
    resize: false,
    rows: 5,
  };

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (this.props.onChange) {
      const { value } = e.currentTarget;
      const { name } = this.props;
      this.props.onChange(e, { name, value });
    }
  };

  render() {
    const {
      disabled, error, label, name, resize, rows, value, width,
    } = this.props;

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
          disabled={disabled}
          name={name}
          onChange={this.handleChange}
          rows={rows}
          value={value}
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
