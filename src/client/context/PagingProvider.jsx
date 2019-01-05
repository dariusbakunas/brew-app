import React from 'react';
import PropTypes from 'prop-types';

export const PagingContext = React.createContext({ pages: {} });

class PagingProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    pages: {},
    getPreviousPage: (key, callback) => {
      this.setState((prevState) => {
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
      this.setState((prevState) => {
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
