import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

function withPagedQuery(query, key, pageSize) {
  return (WrappedComponent) => {
    function getDisplayName(Component) {
      return Component.displayName || Component.name || 'Component';
    }

    class WithPagedQuery extends React.Component {
      static propTypes = {
        getPagedData: PropTypes.shape({
          fetchMore: PropTypes.func,
          loading: PropTypes.bool,
          [key]: PropTypes.shape({
            pageInfo: PropTypes.shape({
              nextCursor: PropTypes.string,
              currentCursor: PropTypes.string,
            }),
          }),
        }).isRequired,
      };

      state = {
        pages: [],
      };

      hasNextPage = () => {
        const entries = this.props.getPagedData[key];
        const nextCursor = entries ? entries.pageInfo.nextCursor : null;
        return !!nextCursor;
      };

      hasPreviousPage = () => this.state.pages.length > 0;

      getNextPage = () => {
        const pageData = this.props.getPagedData[key];
        const nextCursor = pageData ? pageData.pageInfo.nextCursor : null;

        if (nextCursor) {
          const { pages } = this.state;
          pages.push(nextCursor);

          this.setState({ pages });
          this.getPage(nextCursor);
        }
      };

      getPage = (cursor) => {
        const { fetchMore } = this.props.getPagedData;
        const { sortBy } = this.props;

        fetchMore({
          query,
          variables: { cursor, limit: pageSize, sortBy },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newData = fetchMoreResult[key].data;
            const { nextCursor, currentCursor } = fetchMoreResult[key].pageInfo;

            return {
              hops: {
                __typename: previousResult[key].__typename,
                data: [...newData],
                pageInfo: {
                  __typename: previousResult[key].pageInfo.__typename,
                  nextCursor,
                  currentCursor,
                },
              },
            };
          },
        });
      };

      getPreviousPage = () => {
        const { pages } = this.state;
        pages.pop();

        this.setState({ pages });

        const cursor = pages.length > 0 ? pages[pages.length - 1] : null;
        this.getPage(cursor);
      };

      getRefetchQuery = sortBy => ({
        query,
        variables: {
          cursor: this.props.getPagedData[key] ? this.props.getPagedData[key].currentCursor : null,
          sortBy,
          limit: pageSize,
        },
      });

      render() {
        const pagedData = this.props.getPagedData[key];

        return (
          <WrappedComponent
            data={pagedData ? pagedData.data : null}
            loading={this.props.getPagedData.loading}
            hasNextPage={this.hasNextPage}
            hasPreviousPage={this.hasPreviousPage}
            getNextPage={this.getNextPage}
            getPreviousPage={this.getPreviousPage}
            getRefetchQuery={this.getRefetchQuery}
            {...this.props}
          />
        );
      }
    }

    WithPagedQuery.displayName = `WithPagedQuery(${getDisplayName(WrappedComponent)})`;

    return graphql(query, {
      name: 'getPagedData',
      options: props => ({
        notifyOnNetworkStatusChange: true,
        variables: {
          // default props don't seem to work here
          limit: pageSize,
          sortBy: props.sortBy,
        },
      }),
    })(WithPagedQuery);
  };
}

export default withPagedQuery;
