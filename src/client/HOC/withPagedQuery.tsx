import React, { ComponentType } from 'react';
import { graphql } from 'react-apollo';
import { PagingContext, PagingProviderContextType } from '../context/PagingProvider';

interface IVariables {
  cursor?: string;
  limit: number;
  sortBy: string;
}

export interface IPagedQueryProps {
  data: any;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  getNextPage: () => void;
  getPreviousPage: () => void;
  getRefetchQuery: (sortBy: string) => {
    query: any,
    variables: {
      cursor: string,
      sortBy: string,
      limit: number,
    },
  };
  loading: boolean;
}

// TODO: figure out type for gql query
const withPagedQuery = (query: any, key: string, pageSize: number) => {
  return (WrappedComponent: React.ComponentType<Partial<IPagedQueryProps>>) => {
    interface IResponse {
      data: any;
      pageInfo: {
        nextCursor: string,
      };
    }

    interface IWithPagedQueryProps {
      getPagedData: {
        fetchMore: (options: {
          query: any,
          updateQuery: (
            previousResult: {
              [key: string]: { __typename: string, pageInfo: { __typename: string } },
            },
            result: {
              fetchMoreResult: {
                [key: string]: {
                  data: any,
                  pageInfo: {
                    nextCursor: string,
                  },
                },
              },
            },
          ) => void,
          variables: IVariables,
        }) => void,
        loading: boolean,
      } & { [key: string]: IResponse };
      sortBy: string;
    }

    function getDisplayName(component: ComponentType) {
      return component.displayName || component.name || 'Component';
    }

    class WithPagedQuery extends React.Component<IWithPagedQueryProps> {
      public static readonly displayName = `WithPagedQuery(${getDisplayName(WrappedComponent)})`;
      public static contextType = PagingContext;

      public context: PagingProviderContextType;

      public componentDidMount() {
        const { getPreviousPage, setPage } = this.context;

        if (!getPreviousPage || !setPage) {
          console.error('Warning: Wrap component with PagingProvider to enable paging functionality');
        }
      }

      public render() {
        const pagedData = this.props.getPagedData[key];

        return (
          <WrappedComponent
            data={pagedData ? pagedData.data : null}
            loading={this.props.getPagedData.loading}
            hasNextPage={this.hasNextPage()}
            hasPreviousPage={this.hasPreviousPage()}
            getNextPage={this.getNextPage}
            getPreviousPage={this.getPreviousPage}
            getRefetchQuery={this.getRefetchQuery}
            {...this.props}
          />
        );
      }

      private hasNextPage = () => {
        const entries = this.props.getPagedData[key];
        const nextCursor = entries ? entries.pageInfo.nextCursor : null;
        return !!nextCursor;
      }

      private hasPreviousPage = () => this.context.pages[key] && this.context.pages[key].length > 0;

      private getNextPage = () => {
        const pageData = this.props.getPagedData[key];
        const nextCursor = pageData ? pageData.pageInfo.nextCursor : null;

        if (nextCursor) {
          this.context.setPage(key, nextCursor);
          this.getPage(nextCursor);
        }
      }

      private getPage = (cursor: string) => {
        const { fetchMore } = this.props.getPagedData;
        const { sortBy } = this.props;

        fetchMore({
          query,
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newData = fetchMoreResult[key].data;
            const { nextCursor } = fetchMoreResult[key].pageInfo;

            return {
              [key]: {
                __typename: previousResult[key].__typename,
                data: [...newData],
                pageInfo: {
                  __typename: previousResult[key].pageInfo.__typename,
                  nextCursor,
                },
              },
            };
          },
          variables: { cursor, limit: pageSize, sortBy },
        });
      }

      private getPreviousPage = () => {
        this.context.getPreviousPage(key, (cursor) => {
          this.getPage(cursor);
        });
      }

      private getRefetchQuery = (sortBy: string) => ({
        query,
        variables: {
          cursor: this.context.getCurrentCursor(key),
          limit: pageSize,
          sortBy,
        },
      })
    }

    return graphql<{}, IResponse, IVariables>(query, {
      name: 'getPagedData',
      options: (props: { sortBy: string }) => ({
        notifyOnNetworkStatusChange: true,
        variables: {
          // default props don't seem to work here
          limit: pageSize,
          sortBy: props.sortBy,
        },
      }),
      // TODO: figure out typing here
      // @ts-ignore
    })(WithPagedQuery);
  };
};

export default withPagedQuery;
