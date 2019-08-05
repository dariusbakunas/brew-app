import { ApolloError } from 'apollo-client';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Fermentable } from '../../types';
import { Button, IconNav, Pager, Spinner, Table } from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';
import withPagedQuery from '../HOC/withPagedQuery';
import FermentableModal from '../modals/FermentableModal';
import { GET_FERMENTABLES, REMOVE_FERMENTABLE } from '../queries';
import confirm from '../utils/confirm';

const DEFAULT_PAGE_SIZE = 8;

interface IWindow {
  UIkit?: any;
}

declare var window: IWindow;

interface IFermentablesProps {
  fermentables: {
    data: Array<Fermentable & { id: string }>;
    getNextPage: () => void;
    getPrevPage: () => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    loading: boolean;
    refetchQuery: {
      query: any;
      variables: any;
    };
  };
  removeFermentable: (args: { variables: { id: string } }) => Promise<void>;
}

interface IFermentablesState {
  loading: boolean;
  fermentableModalOpen: boolean;
  currentFermentable: null;
}

class FermentablesPage extends React.Component<IFermentablesProps> {
  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    window.UIkit.notification({
      message: errorMessage,
      pos: 'top-right',
      status: 'danger',
      timeout: 5000,
    });
  }

  public readonly state: Readonly<IFermentablesState> = {
    currentFermentable: null,
    fermentableModalOpen: false,
    loading: false,
  };

  public render() {
    const { data: fermentables = [], getNextPage, getPrevPage, hasNextPage, hasPrevPage, loading, refetchQuery } = this.props.fermentables;

    const { currentFermentable, fermentableModalOpen } = this.state;

    return (
      <React.Fragment>
        {fermentables && fermentables.length ? (
          <React.Fragment>
            <Pager hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} onNextPage={getNextPage} onPrevPage={getPrevPage} />
            <Table size="small" stripped={true}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Origin</Table.HeaderCell>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                  <Table.HeaderCell className="uk-visible@m">Type</Table.HeaderCell>
                  <Table.HeaderCell className="uk-visible@s">Color, °L</Table.HeaderCell>
                  <Table.HeaderCell className="uk-visible@s">Potential, SG</Table.HeaderCell>
                  <Table.HeaderCell className="uk-visible@s">Yield, %</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {fermentables.map((fermentable: Fermentable & { id: string }) => (
                  <Table.Row key={fermentable.id}>
                    <Table.Cell>{fermentable.name}</Table.Cell>
                    <Table.Cell className="uk-text-nowrap">{fermentable.origin.name}</Table.Cell>
                    <Table.Cell className="uk-text-nowrap">{fermentable.category}</Table.Cell>
                    <Table.Cell className="uk-text-nowrap uk-visible@m">{fermentable.type}</Table.Cell>
                    <Table.Cell className="uk-text-nowrap uk-visible@s">{fermentable.color ? fermentable.color : 'N/A'}</Table.Cell>
                    <Table.Cell className="uk-text-nowrap uk-visible@s">{fermentable.potential ? fermentable.potential : 'N/A'}</Table.Cell>
                    <Table.Cell className="uk-text-nowrap uk-visible@s">{fermentable.yield}</Table.Cell>
                    <Table.Cell>
                      <IconNav className="uk-text-nowrap">
                        <IconNav.Item icon="pencil" onClick={() => this.handleEditFermentable(fermentable)} />
                        <IconNav.Item icon="trash" onClick={() => this.handleRemoveFermentable(fermentable)} />
                      </IconNav>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </React.Fragment>
        ) : (
          <div className="uk-margin-bottom">No fermentables</div>
        )}
        <Spinner active={loading || this.state.loading} />
        <Button variation="primary" onClick={this.handleAddFermentable}>
          Add
        </Button>
        <FermentableModal
          fermentable={currentFermentable}
          id="fermentable-modal"
          open={fermentableModalOpen}
          onHide={() => this.setState({ fermentableModalOpen: false, currentFermentable: null })}
          refetchQuery={refetchQuery}
        />
      </React.Fragment>
    );
  }

  private handleAddFermentable = () => {
    this.setState({
      currentFermentable: null,
      fermentableModalOpen: true,
    });
  };

  private handleEditFermentable = (fermentable: Fermentable) => {
    this.setState({
      currentFermentable: fermentable,
      fermentableModalOpen: true,
    });
  };

  private handleRemoveFermentable = ({ id, name, origin }: Partial<Fermentable> & { id: string }) => {
    confirm(`Are you sure you want to remove ${name} (${origin.name})?`, () => {
      this.setState({ loading: true }, () => {
        this.props
          .removeFermentable({ variables: { id } })
          .then(() => {
            this.setState({ loading: false });
          })
          .catch((err) => {
            this.setState({ loading: false }, () => {
              FermentablesPage.handleError(err);
            });
          });
      });
    });
  };
}

export default compose(
  withPagedQuery<IFermentablesProps>(GET_FERMENTABLES, (props) => ({
    name: 'fermentables',
    variables: {
      limit: DEFAULT_PAGE_SIZE,
      sortBy: 'NAME',
    },
  })),
  graphql(REMOVE_FERMENTABLE, {
    name: 'removeFermentable',
    options: (props: IFermentablesProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.fermentables.refetchQuery],
    }),
  })
)(FermentablesPage);
