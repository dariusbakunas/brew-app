import React, { ComponentType } from 'react';
import { ServerContext } from '../ServerContext';

function withServerContext(WrappedComponent: ComponentType) {
  function getDisplayName(Component: ComponentType) {
    return Component.displayName || Component.name || 'Component';
  }

  class WithServerContext extends React.Component {
    static readonly displayName = `WithServerContext(${getDisplayName(WrappedComponent)})`;

    render() {
      return (
        <ServerContext.Consumer>
          {
            (context) => <WrappedComponent {...this.props} {...context}/>
          }
        </ServerContext.Consumer>
      );
    }
  }

  return WithServerContext;
}

export default withServerContext;
