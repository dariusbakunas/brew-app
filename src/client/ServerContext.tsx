import React, { ReactNode } from 'react';

export const ServerContext = React.createContext({});

type ServerContextProps = {
  children: ReactNode,
  value: any,
};

export class ServerContextProvider extends React.Component<ServerContextProps> {
  render() {
    return (
      <ServerContext.Provider value={this.props.value}>
        {this.props.children}
      </ServerContext.Provider>
    );
  }
}
