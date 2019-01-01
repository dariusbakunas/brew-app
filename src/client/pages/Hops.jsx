import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import {
  Button, Icon, IconNav, Pager, Spinner, Table,
} from '../components';
import { GET_HOPS, REMOVE_HOP } from '../queries';
import confirm from '../utils/confirm';
import HopModal from '../modals/HopModal';
import handleGraphQLError from '../errors/handleGraphQLError';

const DEFAULT_PAGE_SIZE = 8;

class Hops extends React.Component {
  static propTypes = {
    getHops: PropTypes.shape({
      fetchMore: PropTypes.func,
      loading: PropTypes.bool,
      hops: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
          aaHigh: PropTypes.number,
          aaLow: PropTypes.number,
          betaHigh: PropTypes.number,
          betaLow: PropTypes.number,
          aroma: PropTypes.bool,
          bittering: PropTypes.bool,
          origin: PropTypes.shape({
            name: PropTypes.string,
          }),
        })),
        pageInfo: PropTypes.shape({
          nextCursor: PropTypes.string,
          currentCursor: PropTypes.string,
        }),
      }),
    }),
    pageSize: PropTypes.number,
    removeHop: PropTypes.func.isRequired,
  };

  static defaultProps = {
    pageSize: DEFAULT_PAGE_SIZE,
  };

  state = {
    loading: false,
    hopModalOpen: false,
    currentHop: null,
    pages: [],
  };

  static formatAcidValue(low, high) {
    if (low && high) {
      return `${low.toFixed(1)} - ${high.toFixed(1)}%`;
    }

    if (!low && !high) {
      return 'N/A';
    }

    const num = low || high;

    return `${num.toFixed(1)}%`;
  }

  handleAddHop = () => {
    this.setState({
      currentHop: null,
      hopModalOpen: true,
    });
  };

  handleEditHop = (hop) => {
    this.setState({
      currentHop: hop,
      hopModalOpen: true,
    });
  };

  handleError(error) {
    const { errorMessage } = handleGraphQLError(error, false);

    window.UIkit.notification({
      message: errorMessage,
      status: 'danger',
      pos: 'top-right',
      timeout: 5000,
    });
  }

  handleRemoveHop = ({ id, name, origin }) => {
    confirm(`Are you sure you want to remove ${name} (${origin.name})?`, () => {
      this.setState({ loading: true }, () => {
        this.props.removeHop({ variables: { id } })
          .then(() => {
            this.setState({ loading: false });
          })
          .catch((err) => {
            this.setState({ loading: false }, () => {
              this.handleError(err);
            });
          });
      });
    });
  };

  hasNextPage = () => {
    const { hops } = this.props.getHops;
    const nextCursor = hops ? hops.pageInfo.nextCursor : null;
    return !!nextCursor;
  };

  hasPreviousPage = () => this.state.pages.length > 0;

  getNextPage = () => {
    const { hops } = this.props.getHops;
    const nextCursor = hops ? hops.pageInfo.nextCursor : null;

    if (nextCursor) {
      const { pages } = this.state;
      pages.push(nextCursor);

      this.setState({ pages });
      this.getPage(nextCursor);
    }
  };

  getPage(cursor) {
    const { fetchMore } = this.props.getHops;
    const { pageSize: limit } = this.props;

    fetchMore({
      query: GET_HOPS,
      variables: { cursor, limit, sortBy: 'name' },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newHops = fetchMoreResult.hops.data;
        const { nextCursor, currentCursor } = fetchMoreResult.hops.pageInfo;

        return {
          hops: {
            __typename: previousResult.hops.__typename,
            data: [...newHops],
            pageInfo: {
              __typename: previousResult.hops.pageInfo.__typename,
              nextCursor,
              currentCursor,
            },
          },
        };
      },
    });
  }

  getPreviousPage = () => {
    const { pages } = this.state;
    pages.pop();

    this.setState({ pages });

    const cursor = pages.length > 0 ? pages[pages.length - 1] : null;
    this.getPage(cursor);
  };

  render() {
    const { hops: response, loading } = this.props.getHops;
    const hops = response ? response.data : null;

    return (
      <React.Fragment>
        {
          hops && hops.length ?
            <React.Fragment>
              <Pager
                hasNextPage={this.hasNextPage()}
                hasPrevPage={this.hasPreviousPage()}
                onNextPage={this.getNextPage}
                onPrevPage={this.getPreviousPage}/>
              <Table size='small' stripped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Origin</Table.HeaderCell>
                    <Table.HeaderCell className='uk-visible@s'>Alpha</Table.HeaderCell>
                    <Table.HeaderCell className='uk-visible@m'>Beta</Table.HeaderCell>
                    <Table.HeaderCell className='uk-visible@s uk-table-shrink '>Aroma</Table.HeaderCell>
                    <Table.HeaderCell className='uk-visible@s uk-table-shrink'>Bittering</Table.HeaderCell>
                    <Table.HeaderCell/>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    hops.map(hop => (
                      <Table.Row key={hop.id}>
                        <Table.Cell>{hop.name}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap'>{hop.origin.name}</Table.Cell>
                        <Table.Cell className='uk-visible@s uk-text-nowrap'>{Hops.formatAcidValue(hop.aaLow, hop.aaHigh)}</Table.Cell>
                        <Table.Cell className='uk-visible@m uk-text-nowrap'>{Hops.formatAcidValue(hop.betaLow, hop.betaHigh)}</Table.Cell>
                        <Table.Cell className='uk-visible@s'>
                          {
                            hop.aroma ?
                              <Icon icon='check' width='20px'/> :
                              <Icon icon='close' width='20px'/>
                          }
                        </Table.Cell>
                        <Table.Cell className='uk-visible@s'>
                          {
                            hop.bittering ?
                              <Icon icon='check' width='20px'/> :
                              <Icon icon='close' width='20px'/>
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <IconNav className='uk-text-nowrap'>
                            <IconNav.Item icon='pencil' onClick={() => this.handleEditHop(hop)}/>
                            <IconNav.Item icon='trash' onClick={() => this.handleRemoveHop(hop)}/>
                          </IconNav>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  }
                </Table.Body>
              </Table>
            </React.Fragment> :
            <div className='uk-margin-bottom'>No hops</div>
        }
        <Spinner active={loading || this.state.loading}/>
        <Button variation='primary' onClick={this.handleAddHop}>Add</Button>
        <HopModal
          hop={this.state.currentHop}
          id='hop-modal'
          open={this.state.hopModalOpen}
          onHide={() => this.setState({ hopModalOpen: false, currentHop: null })}
          refetchQuery={{
            query: GET_HOPS,
            variables: {
              cursor: response ? response.pageInfo.currentCursor : null,
              sortBy: 'name',
              limit: this.props.pageSize,
            },
          }}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(GET_HOPS, {
    name: 'getHops',
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        // default props don't seem to work here
        limit: props.pageSize || DEFAULT_PAGE_SIZE,
        sortBy: 'name',
      },
    }),
  }),
  graphql(REMOVE_HOP, {
    name: 'removeHop',
    options: (props) => {
      const { hops } = props.getHops;
      const currentCursor = hops ? hops.pageInfo.currentCursor : null;

      return {
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: GET_HOPS,
            variables: {
              cursor: currentCursor,
              sortBy: 'name',
              limit: props.pageSize,
            },
          },
        ],
      };
    },
  }),
)(Hops);
