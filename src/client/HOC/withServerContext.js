import React from 'react';
import { ServerContext } from '../ServerContext';

function withServerContext(WrappedComponent) {
  function getDisplayName(Component) {
    return Component.displayName || Component.name || 'Component';
  }

  class WithServerContext extends React.Component {
    render() {
      return (
        <ServerContext.Consumer>
          {
            context => <WrappedComponent {...this.props} {...context}/>
          }
        </ServerContext.Consumer>
      );
    }
  }

  WithServerContext.displayName = `WithServerContext(${getDisplayName(WrappedComponent)})`;

  return WithServerContext;
}

export default withServerContext;
