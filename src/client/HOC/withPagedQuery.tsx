import React, { ComponentType } from 'react';
import { graphql } from 'react-apollo';

const PROP_NAME = 'getPagedData';

interface IHOCProps {
  [PROP_NAME]: {
    loading: boolean,
    [key: string]: any,
  };
  variables: any;
}

interface IOptions {
  name: string;
  variables: any;
}

/**
 * /**
 * Adds paging methods, like getNextPage, getPrevPage
 * compatible with current graphql backend implementation
 * @param query GraphQL query
 * @param opt name: property name to hold results
 */
const withPagedQuery = (query: any, opt: (props: any) => IOptions | IOptions) => {
  function getDisplayName(component: ComponentType) {
    return component.displayName || component.name || 'Component';
  }

  return (WrappedComponent: React.ComponentType) => {
    class WithPagedQuery extends React.Component<IHOCProps> {
      public static readonly displayName = `WithPagedQuery(${getDisplayName(WrappedComponent)})`;

      constructor(props) {
        super(props);
        this.state = {};
      }

      public render() {
        const options = (typeof opt === 'function') ? opt(this.props) : opt;

        const { loading } = this.props[PROP_NAME];

        // only support single selection
        const key = this.getQueryKey(query);
        const { pageInfo = {}, data = null } = {...this.props[PROP_NAME][key]};

        const { currentPageInfo = {} } = this.state;

        const props = {
          ...this.props,
          [options.name]: {
            data,
            getNextPage: () => this.getPage(options, pageInfo.nextCursor),
            getPrevPage: () => this.getPage(options, null, pageInfo.prevCursor),
            hasNextPage: !!pageInfo.nextCursor,
            hasPrevPage: !!pageInfo.prevCursor,
            loading,
            refetchQuery: {
              query,
              variables: {
                nextCursor: currentPageInfo.nextCursor,
                prevCursor: currentPageInfo.prevCursor,
                ...options.variables,
              },
            },
          },
        };

        delete(props[PROP_NAME]);

        return (
          <WrappedComponent
            {...props}
          />
        );
      }

      private getQueryKey = (query) => {
        return query.definitions[0].selectionSet.selections[0].name.value;
      }

      private getPage = (options: IOptions, nextCursor: string, prevCursor: string = null) => {
        const { fetchMore } = this.props[PROP_NAME];
        const key = this.getQueryKey(query);

        fetchMore({
          query,
          updateQuery: (previousResult, { fetchMoreResult }) => {
            this.setState({
              currentPageInfo: previousResult[key].pageInfo,
            });

            const newData = fetchMoreResult[key].data;
            const { nextCursor, prevCursor } = fetchMoreResult[key].pageInfo;

            return {
              [key]: {
                __typename: previousResult[key].__typename,
                data: [...newData],
                pageInfo: {
                  __typename: previousResult[key].pageInfo.__typename,
                  nextCursor,
                  prevCursor,
                },
              },
            };
          },
          variables: {
            nextCursor,
            prevCursor,
            ...options.variables,
          },
        });
      }
    }

    return graphql<IHOCProps>(query, {
      name: PROP_NAME,
      options: (props) => {
        const options = (typeof opt === 'function') ? opt(props) : opt;

        return {
          variables: {
            ...options.variables,
          },
        };
      },
    })(WithPagedQuery);
  };
};

export default withPagedQuery;
