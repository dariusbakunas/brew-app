import { ApolloError } from "apollo-client";
import React from "react";
import { compose, graphql } from "react-apollo";
import { Water } from "../../types";
import { Button, IconNav, Pager, Spinner, Table } from "../components";
import handleGraphQLError from "../errors/handleGraphQLError";
import withPagedQuery from "../HOC/withPagedQuery";
import WaterModal from "../modals/WaterModal";
import { GET_WATER, REMOVE_WATER } from "../queries";
import confirm from "../utils/confirm";

const DEFAULT_PAGE_SIZE = 8;

interface IWindow {
  UIkit?: any;
}

declare var window: IWindow;

interface IWaterPageProps {
  water: {
    data: Array<Water & { id: string }>;
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
  removeWater: (args: { variables: { id: string } }) => Promise<void>;
}

interface IWaterPageState {
  loading: boolean;
  waterModalOpen: false;
  currentWater: Water;
}

class WaterPage extends React.Component<IWaterPageProps> {
  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    window.UIkit.notification({
      message: errorMessage,
      pos: "top-right",
      status: "danger",
      timeout: 5000,
    });
  }

  public readonly state: Readonly<IWaterPageState> = {
    currentWater: null,
    loading: false,
    waterModalOpen: false,
  };

  public render() {
    const { data: waterProfiles = [], getNextPage, getPrevPage, hasNextPage, hasPrevPage, loading, refetchQuery } = this.props.water;

    const { currentWater, waterModalOpen } = this.state;

    return (
      <React.Fragment>
        {waterProfiles && waterProfiles.length ? (
          <React.Fragment>
            <Pager hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} onNextPage={getNextPage} onPrevPage={getPrevPage} />
            <Table size="small" stripped={true}>
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
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {waterProfiles.map((water: Water & { id: string }) => (
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
                      <IconNav className="uk-text-nowrap">
                        <IconNav.Item icon="pencil" onClick={() => this.handleEditWater(water)} />
                        <IconNav.Item icon="trash" onClick={() => this.handleRemoveWater(water)} />
                      </IconNav>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </React.Fragment>
        ) : (
          <div className="uk-margin-bottom">No water</div>
        )}
        <Spinner active={loading || this.state.loading} />
        <Button variation="primary" onClick={this.handleAddWater}>
          Add
        </Button>
        <WaterModal water={currentWater} id="water-modal" open={waterModalOpen} onHide={() => this.setState({ waterModalOpen: false, currentWater: null })} refetchQuery={refetchQuery} />
      </React.Fragment>
    );
  }

  private handleAddWater = () => {
    this.setState({
      currentWater: null,
      waterModalOpen: true,
    });
  };

  private handleEditWater = (water: Water) => {
    this.setState({
      currentWater: water,
      waterModalOpen: true,
    });
  };

  private handleRemoveWater = ({ id, name }: Partial<Water> & { id: string }) => {
    confirm(`Are you sure you want to remove ${name}?`, () => {
      this.setState({ loading: true }, () => {
        this.props
          .removeWater({ variables: { id } })
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
}

export default compose(
  withPagedQuery(GET_WATER, (props) => ({
    name: "water",
    variables: {
      limit: DEFAULT_PAGE_SIZE,
      sortBy: "NAME",
    },
  })),
  graphql(REMOVE_WATER, {
    name: "removeWater",
    options: (props: IWaterPageProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.water.refetchQuery],
    }),
  })
)(WaterPage);
