import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import Checkbox from './Checkbox';
import Fieldset from './Fieldset';
import Spinner from '../Spinner';
import TextArea from './TextArea';

class Form extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
  };

  static Fieldset = Fieldset;

  static Input = Input;

  static Checkbox = Checkbox;

  static TextArea = TextArea;

  render() {
    const { children, loading, onSubmit } = this.props;

    return (
      <form onSubmit={onSubmit}>
        {children}
        <Spinner active={loading}/>
      </form>
    );
  }
}

export default Form;
