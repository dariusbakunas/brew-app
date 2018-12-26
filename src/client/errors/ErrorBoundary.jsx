import React from 'react';
import PropTypes from 'prop-types';
import withServerContext from '../HOC/withServerContext';
import formatClientError from './formatClientError';

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    error: PropTypes.shape({
      message: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      error: props.error ? props.error.message : null,
    };
  }

  componentDidCatch(error) {
    const { message } = formatClientError(error);
    this.setState({ error: message });
  }

  render() {
    if (this.state.error) {
      return (
        <div className='main-container'>
          <div className='error-boundary'>
            <h1>UH OH!</h1>
            <div className='uk-text-center uk-text-danger'>{this.state.error}</div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withServerContext(ErrorBoundary);
