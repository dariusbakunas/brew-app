import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Input from './Input';
import Fieldset from './Fieldset';
import Spinner from '../Spinner';

class Form extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
  };

  static Fieldset = Fieldset;
  static Input = Input;

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
