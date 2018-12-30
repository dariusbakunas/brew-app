import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import Table from '../components/Table';
import Spinner from '../components/Spinner';
import IconNav from '../components/IconNav';
import Icon from '../components/Icon';
import { GET_ALL_HOPS, REMOVE_HOP } from '../queries';
import confirm from '../utils/confirm';
import Button from '../components/Button';
import Pager from '../components/Pager';
import HopModal from '../modals/HopModal';

const DEFAULT_PAGE_SIZE = 8;

class Hops extends React.Component {
  static propTypes = {
    getAllHops: PropTypes.shape({
      fetchMore: PropTypes.func,
      loading: PropTypes.bool,
      pagedHops: PropTypes.shape({
        hops: PropTypes.arrayOf(PropTypes.shape({
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
        paging: PropTypes.shape({
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
    const { pagedHops } = this.props.getAllHops;
    const nextCursor = pagedHops ? pagedHops.paging.nextCursor : null;
    return !!nextCursor;
  };

  hasPreviousPage = () => this.state.pages.length > 0;

  getNextPage = () => {
    const { pagedHops } = this.props.getAllHops;
    const nextCursor = pagedHops ? pagedHops.paging.nextCursor : null;

    if (nextCursor) {
      const { pages } = this.state;
      pages.push(nextCursor);

      this.setState({ pages });
      this.getPage(nextCursor);
    }
  };

  getPage(cursor) {
    const { fetchMore } = this.props.getAllHops;
    const { pageSize: limit } = this.props;

    fetchMore({
      query: GET_ALL_HOPS,
      variables: { cursor, limit, sortBy: 'name' },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newHops = fetchMoreResult.pagedHops.hops;
        const { nextCursor, currentCursor } = fetchMoreResult.pagedHops.paging;

        return {
          pagedHops: {
            __typename: previousResult.pagedHops.__typename,
            hops: [...newHops],
            paging: {
              __typename: previousResult.pagedHops.paging.__typename,
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
    const { pagedHops, loading } = this.props.getAllHops;
    const hops = pagedHops ? pagedHops.hops : null;

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
            query: GET_ALL_HOPS,
            variables: {
              cursor: pagedHops ? pagedHops.paging.currentCursor : null,
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
  graphql(GET_ALL_HOPS, {
    name: 'getAllHops',
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
      const { hops } = props.getAllHops;
      const currentCursor = hops ? hops.paging.currentCursor : null;

      return {
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: GET_ALL_HOPS,
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
