import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import withPagedQuery from '../HOC/withPagedQuery';
import { GET_YEAST, REMOVE_YEAST } from '../queries';
import YeastModal from '../modals/YeastModal';
import {
  Button, Pager, Spinner, Table, IconNav,
} from '../components';
import confirm from '../utils/confirm';

const DEFAULT_PAGE_SIZE = 8;

class Yeast extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      form: PropTypes.string,
      description: PropTypes.string,
      type: PropTypes.string,
    })),
    getNextPage: PropTypes.func,
    getPreviousPage: PropTypes.func,
    getRefetchQuery: PropTypes.func,
    hasNextPage: PropTypes.bool,
    hasPreviousPage: PropTypes.bool,
    loading: PropTypes.bool,
    removeYeast: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
    currentYeast: null,
    yeastModalOpen: false,
  };

  handleAddYeast = () => {
    this.setState({
      currentYeast: null,
      yeastModalOpen: true,
    });
  };

  handleEditYeast = (yeast) => {
    this.setState({
      currentYeast: yeast,
      yeastModalOpen: true,
    });
  };

  handleRemoveYeast = ({ id, name, lab }) => {
    confirm(`Are you sure you want to remove ${name} (${lab.name})?`, () => {
      this.setState({ loading: true }, () => {
        this.props.removeYeast({ variables: { id } })
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
    const {
      data: yeastList, loading, hasNextPage, hasPreviousPage,
      getNextPage, getPreviousPage, getRefetchQuery,
    } = this.props;

    const { currentYeast, yeastModalOpen } = this.state;

    return (
      <React.Fragment>
        {
          yeastList && yeastList.length ?
            <React.Fragment>
              <Pager
                hasNextPage={hasNextPage}
                hasPrevPage={hasPreviousPage}
                onNextPage={getNextPage}
                onPrevPage={getPreviousPage}/>
              <Table size='small' stripped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Lab</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Form</Table.HeaderCell>
                    <Table.HeaderCell/>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    yeastList.map(yeast => (
                      <Table.Row key={yeast.id}>
                        <Table.Cell>{yeast.name}</Table.Cell>
                        <Table.Cell>{yeast.lab.name}</Table.Cell>
                        <Table.Cell>{yeast.type}</Table.Cell>
                        <Table.Cell>{yeast.form}</Table.Cell>
                        <Table.Cell>
                          <IconNav className='uk-text-nowrap'>
                            <IconNav.Item icon='pencil' onClick={() => this.handleEditYeast(yeast)}/>
                            <IconNav.Item icon='trash' onClick={() => this.handleRemoveYeast(yeast)}/>
                          </IconNav>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  }
                </Table.Body>
              </Table>
            </React.Fragment> :
            <div className='uk-margin-bottom'>No yeast</div>
        }
        <Spinner active={loading || this.state.loading}/>
        <Button variation='primary' onClick={this.handleAddYeast}>Add</Button>
        <YeastModal
          yeast={currentYeast}
          id='yeast-modal'
          open={yeastModalOpen}
          onHide={() => this.setState({ yeastModalOpen: false, currentYeast: null })}
          refetchQuery={getRefetchQuery('NAME')}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  withPagedQuery(GET_YEAST, 'yeast', DEFAULT_PAGE_SIZE),
  graphql(REMOVE_YEAST, {
    name: 'removeYeast',
    options: props => ({
      awaitRefetchQueries: true,
      refetchQueries: [
        props.getRefetchQuery('NAME'),
      ],
    }),
  }),
)(Yeast);
