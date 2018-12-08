import React from 'react';
import PropTypes from 'prop-types';

export const ServerContext = React.createContext();

export class ServerContextProvider extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    value: PropTypes.object,
  };

  render() {
    return (
      <ServerContext.Provider value={this.props.value}>
        {this.props.children}
      </ServerContext.Provider>
    );
  }
}
