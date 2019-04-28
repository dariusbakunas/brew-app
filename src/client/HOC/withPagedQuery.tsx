import React, { ComponentType } from 'react';
import { graphql } from 'react-apollo';

const PROP_NAME = 'getPagedData';

interface IQueryResult {
  [key: string]: {
    data: any,
    loading: boolean,
    pageInfo: {
      nextCursor: string,
      prevCursor: string,
      __typename: string,
    },
    __typename: string,
  };
}

interface IHOCProps {
  [PROP_NAME]: {
    fetchMore: (args: {
      query: any,
      updateQuery: (previousResult: IQueryResult, result: { fetchMoreResult: IQueryResult }) => void,
      variables: any,
    }) => void,
  } & IQueryResult;
  variables: any;
}

interface IHOCState {
  currentPageInfo: {
    nextCursor: string,
    prevCursor: string,
  };
}

interface IOptions {
  name: string;
  variables: any;
}

/**
 * /**
 * Adds paging methods, like getNextPage, getPrevPage
 * compatible with current graphql backend implementation
 * @param mainQuery GraphQL query
 * @param opt name: property name to hold results
 */
const withPagedQuery = <TProps extends {}>(mainQuery: any, opt: (props: any) => IOptions | IOptions) => {
  function getDisplayName(component: ComponentType) {
    return component.displayName || component.name || 'Component';
  }

  return (WrappedComponent: React.ComponentType) => {
    class WithPagedQuery extends React.Component<IHOCProps & TProps, IHOCState> {
      public static readonly displayName = `WithPagedQuery(${getDisplayName(WrappedComponent)})`;

      constructor(props: IHOCProps & TProps) {
        super(props);
        this.state = {
          currentPageInfo: {
            nextCursor: null,
            prevCursor: null,
          },
        };
      }

      public render() {
        const options = (typeof opt === 'function') ? opt(this.props) : opt;

        const { loading } = this.props[PROP_NAME];

        // only support single selection
        const key = this.getQueryKey(mainQuery);
        const { pageInfo, data = null } = {...this.props[PROP_NAME][key]};

        const { currentPageInfo } = this.state;

        const childProps: any = {
          ...this.props,
          [options.name]: {
            data,
            getNextPage: () => this.getPage(options, pageInfo.nextCursor),
            getPrevPage: () => this.getPage(options, null, pageInfo.prevCursor),
            hasNextPage: pageInfo ? !!pageInfo.nextCursor : false,
            hasPrevPage: pageInfo ? !!pageInfo.prevCursor : false,
            loading,
            refetchQuery: {
              query: mainQuery,
              variables: {
                nextCursor: currentPageInfo.nextCursor,
                prevCursor: currentPageInfo.prevCursor,
                ...options.variables,
              },
            },
          },
        };

        delete childProps[PROP_NAME];

        return (
          <WrappedComponent
            {...childProps}
          />
        );
      }

      private getQueryKey = (query: any) => {
        return query.definitions[0].selectionSet.selections[0].name.value;
      }

      private getPage = (options: IOptions, nextCursor: string, prevCursor: string = null) => {
        const { fetchMore } = this.props[PROP_NAME];
        const key = this.getQueryKey(mainQuery);

        fetchMore({
          query: mainQuery,
          updateQuery: (previousResult, { fetchMoreResult }) => {
            this.setState({
              currentPageInfo: previousResult[key].pageInfo,
            });

            const newData = fetchMoreResult[key].data;
            const { nextCursor: next, prevCursor: prev } = fetchMoreResult[key].pageInfo;

            return {
              [key]: {
                __typename: previousResult[key].__typename,
                data: [...newData],
                pageInfo: {
                  __typename: previousResult[key].pageInfo.__typename,
                  nextCursor: next,
                  prevCursor: prev,
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

    return graphql<IHOCProps>(mainQuery, {
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
