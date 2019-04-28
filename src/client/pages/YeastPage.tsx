import { ApolloError } from 'apollo-client';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { IYeast } from '../../types';
import {
  Button, IconNav, Pager, Spinner, Table,
} from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';
import withPagedQuery from '../HOC/withPagedQuery';
import YeastModal from '../modals/YeastModal';
import { GET_YEAST, REMOVE_YEAST } from '../queries';
import confirm from '../utils/confirm';

const DEFAULT_PAGE_SIZE = 8;

interface IWindow {
  UIkit?: any;
}

declare var window: IWindow;

interface IYeastPageProps {
  yeast: {
    data: Array<IYeast & { id: string }>,
    getNextPage: () => void,
    getPrevPage: () => void,
    hasNextPage: boolean,
    hasPrevPage: boolean,
    loading: boolean,
    refetchQuery: {
      query: any,
      variables: any,
    },
  };
  removeYeast: (args: { variables: { id: string } }) => Promise<void>;
}

interface IYeastPageState {
  loading: boolean;
  yeastModalOpen: boolean;
  currentYeast: IYeast;
}

class YeastPage extends React.Component<IYeastPageProps> {
  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    window.UIkit.notification({
      message: errorMessage,
      pos: 'top-right',
      status: 'danger',
      timeout: 5000,
    });
  }

  public readonly state: IYeastPageState = {
    currentYeast: null,
    loading: false,
    yeastModalOpen: false,
  };

  public render() {
    const {
      data: yeastList = [],
      getNextPage,
      getPrevPage,
      hasNextPage,
      hasPrevPage,
      loading,
      refetchQuery,
    } = this.props.yeast;

    const { currentYeast, yeastModalOpen } = this.state;

    return (
      <React.Fragment>
        {
          yeastList && yeastList.length ?
            <React.Fragment>
              <Pager
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                onNextPage={getNextPage}
                onPrevPage={getPrevPage}/>
              <Table size='small' stripped={true}>
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
                    yeastList.map((yeast: IYeast & { id: string }) => (
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
                    ))}
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
          refetchQuery={refetchQuery}
        />
      </React.Fragment>
    );
  }

  private handleAddYeast = () => {
    this.setState({
      currentYeast: null,
      yeastModalOpen: true,
    });
  }

  private handleEditYeast = (yeast: IYeast) => {
    this.setState({
      currentYeast: yeast,
      yeastModalOpen: true,
    });
  }

  private handleRemoveYeast = ({ id, name, lab }: Partial<IYeast> & { id: string }) => {
    confirm(`Are you sure you want to remove ${name} (${lab.name})?`, () => {
      this.setState({ loading: true }, () => {
        this.props.removeYeast({ variables: { id } })
          .then(() => {
            this.setState({ loading: false });
          })
          .catch((err) => {
            this.setState({ loading: false }, () => {
              YeastPage.handleError(err);
            });
          });
      });
    });
  }
}

export default compose(
  withPagedQuery(GET_YEAST, (props) => ({
    name: 'yeast',
    variables: {
      limit: DEFAULT_PAGE_SIZE,
      sortBy: 'NAME',
    },
  })),
  graphql(REMOVE_YEAST, {
    name: 'removeYeast',
    options: (props: IYeastPageProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [
        props.yeast.refetchQuery,
      ],
    }),
  }),
)(YeastPage);
