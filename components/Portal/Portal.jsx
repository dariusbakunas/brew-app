import React from 'react';
import ReactDOM from 'react-dom';

export class Portal extends React.Component {
  render () {
    const element = typeof document !== 'undefined' ? document.querySelector(this.props.selector) : null;

    if (element === null) {
      return null;
    }

    return ReactDOM.createPortal(this.props.children, element);
  }
}

export default Portal;
