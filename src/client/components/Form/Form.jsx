import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Input from './Input';
import Fieldset from './Fieldset';

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
        {
          loading &&
          <div className="uk-overlay-default uk-position-cover">
            <div className="uk-position-center">
              <div data-uk-spinner="ratio: 2"/>
            </div>
          </div>
        }
      </form>
    );
  }
}

export default Form;
