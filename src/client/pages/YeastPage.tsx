import React from 'react';
import { compose, graphql } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import withPagedQuery, { IPagedQueryProps } from '../../../HOC/withPagedQuery';
import { GET_YEAST, REMOVE_YEAST } from '../../../queries';
import YeastModal from '../modals/YeastModal';
import {
  Button, Pager, Spinner, Table, IconNav,
} from '../../../components';
import confirm from '../utils/confirm';
import { IYeast } from '../../../types';
import handleGraphQLError from '../../../errors/handleGraphQLError';

const DEFAULT_PAGE_SIZE = 8;

type YeastPageProps = IPagedQueryProps & {
  data: Array<IYeast & { id: string }>,
  loading: boolean,
  removeYeast: (args: { variables: { id: string } }) => Promise<void>,
};

type YeastPageState = {
  loading: boolean,
  yeastModalOpen: boolean,
  currentYeast: IYeast,
};

class YeastPage extends React.Component<YeastPageProps> {
  readonly state: YeastPageState = {
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

  handleEditYeast = (yeast: IYeast) => {
    this.setState({
      currentYeast: yeast,
      yeastModalOpen: true,
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

  handleRemoveYeast = ({ id, name, lab }: Partial<IYeast> & { id: string }) => {
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
    options: (props: YeastPageProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [
        props.getRefetchQuery('NAME'),
      ],
    }),
  }),
)(YeastPage);
