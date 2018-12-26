import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import getUnhandledProps from '../../utils/getUnhandledProps';

class TextArea extends React.Component {
  handleChange = (e) => {
    if (this.props.onChange) {
      const { value } = e.target;
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

TextArea.defaultProps = {
  resize: false,
  rows: 5,
};

TextArea.propTypes = {
  error: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  resize: PropTypes.bool,
  rows: PropTypes.number,
  width: PropTypes.oneOf(['large', 'medium', 'small', 'xsmall']),
};

export default TextArea;
