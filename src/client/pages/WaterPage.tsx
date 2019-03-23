import React from 'react';
import { compose, graphql } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import withPagedQuery, { IPagedQueryProps } from '../../../HOC/withPagedQuery';
import { GET_WATER, REMOVE_WATER } from '../../../queries';
import handleGraphQLError from '../../../errors/handleGraphQLError';
import {
  Button, Pager, Spinner, Table, IconNav,
} from '../../../components';
import WaterModal from '../modals/WaterModal';
import confirm from '../utils/confirm';
import { Water } from '../../../types';

const DEFAULT_PAGE_SIZE = 8;

type WaterPageProps = IPagedQueryProps & {
  data: Array<Water & { id: string }>,
  loading: boolean,
  removeWater: (args: { variables: { id: string } }) => Promise<void>,
};

type WaterPageState = {
  loading: boolean,
  waterModalOpen: false,
  currentWater: Water,
};

class WaterPage extends React.Component<WaterPageProps> {
  readonly state: Readonly<WaterPageState> = {
    loading: false,
    waterModalOpen: false,
    currentWater: null,
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

  handleAddWater = () => {
    this.setState({
      currentWater: null,
      waterModalOpen: true,
    });
  };

  handleEditWater = (water: Water) => {
    this.setState({
      currentWater: water,
      waterModalOpen: true,
    });
  };

  handleRemoveWater = ({ id, name }: Partial<Water> & { id: string }) => {
    confirm(`Are you sure you want to remove ${name}?`, () => {
      this.setState({ loading: true }, () => {
        this.props.removeWater({ variables: { id } })
          .then(() => {
            this.setState({ loading: false });
          })
          .catch((err) => {
            this.setState({ loading: false }, () => {
              WaterPage.handleError(err);
            });
          });
      });
    });
  };

  render() {
    const {
      data: waterProfiles, loading, hasNextPage, hasPreviousPage,
      getNextPage, getPreviousPage, getRefetchQuery,
    } = this.props;

    const { currentWater, waterModalOpen } = this.state;

    return (
      <React.Fragment>
        {
          waterProfiles && waterProfiles.length ?
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
                    <Table.HeaderCell>pH</Table.HeaderCell>
                    <Table.HeaderCell>Alkalinity (CaCO&#8323;)</Table.HeaderCell>
                    <Table.HeaderCell>Calcium</Table.HeaderCell>
                    <Table.HeaderCell>Magnesium</Table.HeaderCell>
                    <Table.HeaderCell>Sodium</Table.HeaderCell>
                    <Table.HeaderCell>Sulfate</Table.HeaderCell>
                    <Table.HeaderCell>Chloride</Table.HeaderCell>
                    <Table.HeaderCell>Bicarbonate</Table.HeaderCell>
                    <Table.HeaderCell/>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    waterProfiles.map((water: Water & { id: string }) => (
                      <Table.Row key={water.id}>
                        <Table.Cell>{water.name}</Table.Cell>
                        <Table.Cell>{water.pH}</Table.Cell>
                        <Table.Cell>{water.alkalinity}</Table.Cell>
                        <Table.Cell>{water.calcium}</Table.Cell>
                        <Table.Cell>{water.magnesium}</Table.Cell>
                        <Table.Cell>{water.sodium}</Table.Cell>
                        <Table.Cell>{water.sulfate}</Table.Cell>
                        <Table.Cell>{water.chloride}</Table.Cell>
                        <Table.Cell>{water.bicarbonate}</Table.Cell>
                        <Table.Cell>
                          <IconNav className='uk-text-nowrap'>
                            <IconNav.Item icon='pencil' onClick={() => this.handleEditWater(water)}/>
                            <IconNav.Item icon='trash' onClick={() => this.handleRemoveWater(water)}/>
                          </IconNav>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  }
                </Table.Body>
              </Table>
            </React.Fragment> :
            <div className='uk-margin-bottom'>No water</div>
        }
        <Spinner active={loading || this.state.loading}/>
        <Button variation='primary' onClick={this.handleAddWater}>Add</Button>
        <WaterModal
          water={currentWater}
          id='water-modal'
          open={waterModalOpen}
          onHide={() => this.setState({ waterModalOpen: false, currentWater: null })}
          refetchQuery={getRefetchQuery('NAME')}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  withPagedQuery(GET_WATER, 'water', DEFAULT_PAGE_SIZE),
  graphql(REMOVE_WATER, {
    name: 'removeWater',
    options: (props: WaterPageProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [
        props.getRefetchQuery('NAME'),
      ],
    }),
  }),
)(WaterPage);
