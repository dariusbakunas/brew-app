import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { GET_FERMENTABLES, REMOVE_FERMENTABLE } from '../queries';
import confirm from '../utils/confirm';
import {
  Button, Pager, Spinner, Table, IconNav,
} from '../components';
import FermentableModal from '../modals/FermentableModal';
import handleGraphQLError from '../errors/handleGraphQLError';
import withPagedQuery from '../HOC/withPagedQuery';

const DEFAULT_PAGE_SIZE = 8;

class Fermentables extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      category: PropTypes.string,
      type: PropTypes.string,
    })),
    getNextPage: PropTypes.func,
    getPreviousPage: PropTypes.func,
    getRefetchQuery: PropTypes.func,
    hasNextPage: PropTypes.bool,
    hasPreviousPage: PropTypes.bool,
    loading: PropTypes.bool,
    removeFermentable: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
    fermentableModalOpen: false,
    currentFermentable: null,
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

  handleAddFermentable = () => {
    this.setState({
      currentFermentable: null,
      fermentableModalOpen: true,
    });
  };

  handleEditFermentable = (fermentable) => {
    this.setState({
      currentFermentable: fermentable,
      fermentableModalOpen: true,
    });
  };

  handleRemoveFermentable = ({ id, name, origin }) => {
    confirm(`Are you sure you want to remove ${name} (${origin.name})?`, () => {
      this.setState({ loading: true }, () => {
        this.props.removeFermentable({ variables: { id } })
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
      data: fermentables, loading, hasNextPage, hasPreviousPage,
      getNextPage, getPreviousPage, getRefetchQuery,
    } = this.props;
    const { currentFermentable, fermentableModalOpen } = this.state;

    return (
      <React.Fragment>
        {
          fermentables && fermentables.length ?
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
                    <Table.HeaderCell>Origin</Table.HeaderCell>
                    <Table.HeaderCell>Category</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Color (SRM)</Table.HeaderCell>
                    <Table.HeaderCell>Potential (SG)</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    fermentables.map(fermentable => (
                      <Table.Row key={fermentable.id}>
                        <Table.Cell>{fermentable.name}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap'>{fermentable.origin.name}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap'>{fermentable.category}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap'>{fermentable.type}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap'>{fermentable.color ? fermentable.color : 'N/A'}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap'>{fermentable.potential ? fermentable.potential : 'N/A'}</Table.Cell>
                        <Table.Cell>
                          <IconNav className='uk-text-nowrap'>
                            <IconNav.Item icon='pencil' onClick={() => this.handleEditFermentable(fermentable)}/>
                            <IconNav.Item icon='trash' onClick={() => this.handleRemoveFermentable(fermentable)}/>
                          </IconNav>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  }
                </Table.Body>
              </Table>
            </React.Fragment> :
            <div className='uk-margin-bottom'>No fermentables</div>
        }
        <Spinner active={loading || this.state.loading}/>
        <Button variation='primary' onClick={this.handleAddFermentable}>Add</Button>
        <FermentableModal
          fermentable={currentFermentable}
          id='fermentable-modal'
          open={fermentableModalOpen}
          onHide={() => this.setState({ fermentableModalOpen: false, currentFermentable: null })}
          refetchQuery={getRefetchQuery('NAME')}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  withPagedQuery(GET_FERMENTABLES, 'fermentables', DEFAULT_PAGE_SIZE),
  graphql(REMOVE_FERMENTABLE, {
    name: 'removeFermentable',
    options: props => ({
      awaitRefetchQueries: true,
      refetchQueries: [
        props.getRefetchQuery('NAME'),
      ],
    }),
  }),
)(Fermentables);
