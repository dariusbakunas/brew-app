import React from 'react';
import PropTypes from 'prop-types';
import withServerContext from "../HOC/withServerContext";

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    error: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      error: props.error,
    };
  }

  componentDidCatch(error) {
    if (error.constructor.name === 'AuthorizationError') {
      this.setState({ error: 'Your are not authorized to access this resource' });
    } else if (error.constructor.name === 'ServerError') {
      this.setState({ error: 'Unknown error occurred, please try again' });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className='uk-flex uk-flex-middle uk-flex-center uk-flex-column' style={{ height: '100%' }}>
          <h1>UH OH!</h1>
          <div className='uk-text-center uk-text-danger'>{this.state.error}</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withServerContext(ErrorBoundary);
