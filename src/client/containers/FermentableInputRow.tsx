import gql from "graphql-tag";
import React from "react";
import { Fermentable } from "../../types";
import { Button, Form } from "../components";
import { IAutoCompleteItem } from "../components/Form/AutoComplete";
import Input from "../components/Form/Input";
import Select from "../components/Form/Select";
import withPagedQuery from "../HOC/withPagedQuery";

const GET_FERMENTABLES = gql`
  query GetFermentables($nextCursor: String, $limit: Int, $filter: FermentablesFilter, $sortBy: SortableFermentableField, $sortDirection: SortDirection) {
    fermentables(nextCursor: $nextCursor, limit: $limit, filter: $filter, sortBy: $sortBy, sortDirection: $sortDirection) {
      data {
        id
        name
      }
      pageInfo {
        nextCursor
      }
    }
  }
`;

interface IFermentable {
  id?: string;
  name?: string;
  unit: "lbs" | "oz";
  amount?: number;
}

interface IFermentableInputRowProps {
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
    refetch: (variables: any) => void;
  };
  fermentable: IFermentable;
  onChange: (fermentable: IFermentable) => void;
  onRemove: () => void;
}

interface IFermentableInputRowState {
  fermentable?: string;
  name: string;
  unit?: "lb" | "oz";
  amount?: number;
}

class FermentableInputRow extends React.Component<IFermentableInputRowProps, IFermentableInputRowState> {
  public render() {
    const {
      fermentable: { id, name: fermentableName, unit, amount },
    } = this.props;
    const { data: fermentables = [], loading } = ({} = this.props.fermentables);

    const items = fermentables.map((item) => ({
      label: item.name,
      value: item.id,
    }));

    return (
      <div className="uk-flex uk-flex-bottom" data-uk-grid={true}>
        <div>
          <Input label="Amount" name="amount" type="number" required={true} onChange={this.handleChange} step={0.1} min={0} value={amount} />
        </div>
        <div>
          <Select
            name="unit"
            onChange={(e, { name, value }) => this.handleChange(e, { name, value: value.toUpperCase() })}
            options={[{ value: "lb", label: "lb" }, { value: "oz", label: "oz" }]}
            value={unit.toLowerCase()}
          />
        </div>
        <div className="uk-width-expand">
          <Form.AutoComplete
            debounced={true}
            items={items}
            label="Fermentable"
            name="id"
            required={true}
            selected={{ value: id, label: fermentableName }}
            onInputChange={this.handleInputChange}
            onSelect={this.handleSelect}
          />
        </div>
        {/* TODO: fine better way to align row contents */}
        <div className="uk-width-auto">
          <Button variation="danger" onClick={this.handleRemove}>
            Remove
          </Button>
        </div>
      </div>
    );
  }

  private handleRemove = () => {
    if (this.props.onRemove) {
      this.props.onRemove();
    }
  };

  private handleSelect = (item: IAutoCompleteItem) => {
    if (this.props.onChange) {
      const fermentable = {
        ...this.props.fermentable,
        id: item.value,
        name: item.label,
      };

      this.props.onChange(fermentable);
    }
  };

  private handleChange = (e: React.ChangeEvent<HTMLSelectElement>, { name, value }: { name: string; value: string }) => {
    if (this.props.onChange) {
      const fermentable = {
        ...this.props.fermentable,
        [name]: value,
      };

      this.props.onChange(fermentable);
    }
  };

  private handleInputChange = (value: string) => {
    const { refetch } = this.props.fermentables;
    refetch({
      filter: {
        name: value,
      },
      limit: 15,
      sortBy: "NAME",
    });
  };
}

interface IQueryOpts {
  fetchPolicy?: string;
  name: string;
  variables: {
    filter?: {
      name: string;
    };
    limit: number;
    sortBy: string;
  };
}

export default withPagedQuery(GET_FERMENTABLES, (props) => {
  const options: IQueryOpts = {
    fetchPolicy: "no-cache",
    name: "fermentables",
    variables: {
      limit: 15,
      sortBy: "NAME",
    },
  };

  if (props.fermentable.name) {
    options.variables.filter = {
      name: props.fermentable.name,
    };
  }

  return options;
})(FermentableInputRow);
