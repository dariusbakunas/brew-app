import React from 'react';
import { compose, graphql } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import {
  Button, Icon, IconNav, Pager, Spinner, Table,
} from '../components';
import { GET_HOPS, REMOVE_HOP } from '../queries';
import confirm from '../utils/confirm';
import HopModal from '../modals/HopModal';
import handleGraphQLError from '../errors/handleGraphQLError';
import withPagedQuery, { PagedQueryProps } from '../HOC/withPagedQuery';

const DEFAULT_PAGE_SIZE = 8;

type Hop = {
  id: string,
  aaLow?: number,
  aaHigh?: number,
  aroma: boolean,
  bittering: boolean,
  betaLow?: number,
  betaHigh?: number,
  description: string,
  name: string,
  origin: {
    name: string,
  }
};

type HopsProps = PagedQueryProps & {
  data: Hop[],
  loading: boolean,
  removeHop: (args: { variables: { id: string } }) => Promise<void>,
};

type HopState = {
  loading: boolean,
  hopModalOpen: boolean,
  currentHop: Hop,
};

class Hops extends React.Component<HopsProps> {
  readonly state: Readonly<HopState> = {
    loading: false,
    hopModalOpen: false,
    currentHop: null,
  };

  static formatAcidValue(low: number, high: number) {
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

  handleEditHop = (hop: Hop) => {
    this.setState({
      currentHop: hop,
      hopModalOpen: true,
    });
  };

  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    window.UIkit.notification({
      message: errorMessage,
      status: 'danger',
      pos: 'top-right',
      timeout: 5000,
    });
  }

  handleRemoveHop = ({ id, name, origin }: Partial<Hop>) => {
    confirm(`Are you sure you want to remove ${name} (${origin.name})?`, () => {
      this.setState({ loading: true }, () => {
        this.props.removeHop({ variables: { id } })
          .then(() => {
            this.setState({ loading: false });
          })
          .catch((err: ApolloError) => {
            this.setState({ loading: false }, () => {
              Hops.handleError(err);
            });
          });
      });
    });
  };

  render() {
    const { data: hops, loading } = this.props;

    return (
      <React.Fragment>
        {
          hops && hops.length ?
            <React.Fragment>
              <Pager
                hasNextPage={this.props.hasNextPage}
                hasPrevPage={this.props.hasPreviousPage}
                onNextPage={this.props.getNextPage}
                onPrevPage={this.props.getPreviousPage}/>
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
                    hops.map((hop: Hop) => (
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
          refetchQuery={this.props.getRefetchQuery('name')}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  withPagedQuery(GET_HOPS, 'hops', DEFAULT_PAGE_SIZE),
  graphql(REMOVE_HOP, {
    name: 'removeHop',
    options: (props: HopsProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [
        props.getRefetchQuery('name'),
      ],
    }),
  }),
)(Hops);
