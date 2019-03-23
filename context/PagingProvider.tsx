import React, { ReactNode } from 'react';

export const PagingContext = React.createContext({ pages: {} });

type PagingProviderProps = {
  children: ReactNode,
};

export type PagingProviderContextType = {
  pages: {
    [key: string]: string[],
  },
  getPreviousPage: (key: string, callback: (cursor?: string) => void) => void,
  setPage: (key: string, cursor: string) => void,
  getCurrentCursor: (key: string) => string,
};

class PagingProvider extends React.Component<PagingProviderProps> {
  readonly state: Readonly<PagingProviderContextType> = {
    pages: {},
    getPreviousPage: (key, callback) => {
      this.setState((prevState: Readonly<PagingProviderContextType>) => {
        const pages = prevState.pages[key] ? [...prevState.pages[key]] : [];
        pages.pop();

        return {
          pages: {
            ...prevState.pages,
            [key]: pages,
          },
        };
      }, () => {
        const pages = this.state.pages[key];
        callback(pages.length > 0 ? pages[pages.length - 1] : null);
      });
    },
    setPage: (key, cursor) => {
      this.setState((prevState: Readonly<PagingProviderContextType>) => {
        const pages = prevState.pages[key] ? [...prevState.pages[key]] : [];
        pages.push(cursor);

        return {
          pages: {
            ...prevState.pages,
            [key]: pages,
          },
        };
      });
    },
    getCurrentCursor: (key) => {
      const pages = this.state.pages[key];
      return pages && pages.length > 0 ? pages[pages.length - 1] : null;
    },
  };

  render() {
    return (
      <PagingContext.Provider value={this.state}>
        {this.props.children}
      </PagingContext.Provider>
    );
  }
}

export default PagingProvider;
