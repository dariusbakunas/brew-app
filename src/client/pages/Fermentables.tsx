import React from 'react';
import { compose, graphql } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import { GET_FERMENTABLES, REMOVE_FERMENTABLE } from '../queries';
import confirm from '../utils/confirm';
import {
  Button, Pager, Spinner, Table, IconNav,
} from '../components';
import FermentableModal from '../modals/FermentableModal';
import handleGraphQLError from '../errors/handleGraphQLError';
import withPagedQuery, { PagedQueryProps } from '../HOC/withPagedQuery';
import { Fermentable } from '../../types';

const DEFAULT_PAGE_SIZE = 8;

type FermentablesProps = PagedQueryProps & {
  data: Array<Fermentable & { id: string }>,
  loading: boolean,
  removeFermentable: (args: { variables: { id: string } }) => Promise<void>,
};

type FermentablesState = {
  loading: boolean,
  fermentableModalOpen: boolean,
  currentFermentable: null,
};

class Fermentables extends React.Component<FermentablesProps> {
  readonly state: Readonly<FermentablesState> = {
    loading: false,
    fermentableModalOpen: false,
    currentFermentable: null,
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

  handleAddFermentable = () => {
    this.setState({
      currentFermentable: null,
      fermentableModalOpen: true,
    });
  };

  handleEditFermentable = (fermentable: Fermentable) => {
    this.setState({
      currentFermentable: fermentable,
      fermentableModalOpen: true,
    });
  };

  handleRemoveFermentable = ({ id, name, origin }: Partial<Fermentable> & { id: string }) => {
    confirm(`Are you sure you want to remove ${name} (${origin.name})?`, () => {
      this.setState({ loading: true }, () => {
        this.props.removeFermentable({ variables: { id } })
          .then(() => {
            this.setState({ loading: false });
          })
          .catch((err) => {
            this.setState({ loading: false }, () => {
              Fermentables.handleError(err);
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
                    <Table.HeaderCell className='uk-visible@m'>Type</Table.HeaderCell>
                    <Table.HeaderCell className='uk-visible@s'>Color, °L</Table.HeaderCell>
                    <Table.HeaderCell className='uk-visible@s'>Potential, SG</Table.HeaderCell>
                    <Table.HeaderCell className='uk-visible@s'>Yield, %</Table.HeaderCell>
                    <Table.HeaderCell/>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    fermentables.map((fermentable: Fermentable & { id: string }) => (
                      <Table.Row key={fermentable.id}>
                        <Table.Cell>{fermentable.name}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap'>{fermentable.origin.name}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap'>{fermentable.category}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap uk-visible@m'>{fermentable.type}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap uk-visible@s'>{fermentable.color ? fermentable.color : 'N/A'}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap uk-visible@s'>{fermentable.potential ? fermentable.potential : 'N/A'}</Table.Cell>
                        <Table.Cell className='uk-text-nowrap uk-visible@s'>{fermentable.yield}</Table.Cell>
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
    options: (props: FermentablesProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [
        props.getRefetchQuery('NAME'),
      ],
    }),
  }),
)(Fermentables);
