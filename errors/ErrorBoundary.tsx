import React, { ReactNode } from 'react';
import { ApolloError } from 'apollo-client';
import withServerContext from '../HOC/withServerContext';
import formatClientError from './formatClientError';

type ErrorBoundaryProps = {
  children: ReactNode,
  error?: {
    message: string,
  }
};

type ErrorBoundaryState = {
  error?: string,
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  readonly state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: props.error ? props.error.message : null,
    };
  }

  componentDidCatch(error: ApolloError) {
    const { message } = formatClientError(error);
    this.setState({ error: message });
  }

  render() {
    if (this.state.error) {
      return (
        <div className='error-boundary'>
          <h1>UH OH!</h1>
          <div className='uk-text-center uk-text-danger'>{this.state.error}</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withServerContext(ErrorBoundary);
