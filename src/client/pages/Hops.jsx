import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import Table from '../components/Table';
import Spinner from '../components/Spinner';
import IconNav from '../components/IconNav';
import {GET_ALL_HOPS, GET_ALL_INVITATIONS, REMOVE_HOP} from '../queries';
import confirm from '../utils/confirm';
import Button from '../components/Button';
import HopModal from '../modals/HopModal';

class Hops extends React.Component {
  static propTypes = {
    getAllHops: PropTypes.shape({
      loading: PropTypes.bool,
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
    }),
    removeHop: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
  };

  static formatAcidValue(low, high) {
    if (low && high) {
      return `${low.toFixed(1)} - ${high.toFixed(1)}%`;
    }

    if (!low && !high) {
      return 'N/A';
    }

    const num = low || high;

    return `${num.toFixed(1)}`;
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

  render() {
    const { hops, loading } = this.props.getAllHops;

    return (
      <React.Fragment>
        {
          hops && hops.length ?
            <Table size='small' stripped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Origin</Table.HeaderCell>
                  <Table.HeaderCell>Alpha</Table.HeaderCell>
                  <Table.HeaderCell>Beta</Table.HeaderCell>
                  <Table.HeaderCell/>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  hops.map(hop => (
                    <Table.Row key={hop.id}>
                      <Table.Cell>{hop.name}</Table.Cell>
                      <Table.Cell>{hop.origin.name}</Table.Cell>
                      <Table.Cell>{Hops.formatAcidValue(hop.aaLow, hop.aaHigh)}</Table.Cell>
                      <Table.Cell>{Hops.formatAcidValue(hop.betaLow, hop.betaHigh)}</Table.Cell>
                      <Table.Cell>
                        <IconNav>
                          <IconNav.Item icon='trash' onClick={() => this.handleRemoveHop(hop)}/>
                        </IconNav>
                      </Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table> :
            <div className='uk-margin-bottom'>No hops</div>
        }
        <Spinner active={loading || this.state.loading}/>
        <Button variation='primary' data-uk-toggle="target: #hop-modal">Add</Button>
        <HopModal id='hop-modal'/>
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(GET_ALL_HOPS, { name: 'getAllHops' }),
  graphql(REMOVE_HOP, {
    name: 'removeHop',
    options: {
      update: (cache, { data: { removeHop: id } }) => {
        const { hops } = cache.readQuery({ query: GET_ALL_HOPS });
        cache.writeQuery({
          query: GET_ALL_HOPS,
          data: { hops: hops.filter(hop => hop.id !== id) },
        });
      },
    },
  }),
)(Hops);
