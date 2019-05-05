import gql from 'graphql-tag';
import React from 'react';
import { Fermentable } from '../../types';
import { Button, Form } from '../components';
import Input, { InputChangeHandlerType } from '../components/Form/Input';
import Select from '../components/Form/Select';
import withPagedQuery from '../HOC/withPagedQuery';

const GET_FERMENTABLES = gql`
  query GetFermentables(
  $nextCursor: String,
  $limit: Int,
  $filter: FermentablesFilter,
  $sortBy: SortableFermentableField,
  $sortDirection: SortDirection) {
    fermentables(
      nextCursor: $nextCursor,
      limit: $limit,
      filter: $filter,
      sortBy: $sortBy,
      sortDirection: $sortDirection) {
      data {
        id
        name
      }
      pageInfo {
        nextCursor
      }
    }
  }`;

interface IFermentable {
  id?: string;
  name?: string;
  unit: 'lbs' | 'oz';
  weight?: number;
}

interface IFermentableInputRowProps {
  fermentables: {
    data: Array<Fermentable & { id: string }>,
    getNextPage: () => void,
    getPrevPage: () => void,
    hasNextPage: boolean,
    hasPrevPage: boolean,
    loading: boolean,
    refetchQuery: {
      query: any,
      variables: any,
    },
    refetch: (variables: any) => void,
  };
  fermentable: IFermentable;
  onChange: (fermentable: IFermentable) => void;
  onRemove: () => void;
}

interface IFermentableInputRowState {
  fermentable?: string;
  name: string;
  unit?: 'lbs' | 'oz';
  weight?: number;
}

class FermentableInputRow extends React.Component<IFermentableInputRowProps, IFermentableInputRowState> {
  public render() {
    const { fermentable: { id, name, unit, weight } } = this.props;
    const { data: fermentables = [], loading } = {} = this.props.fermentables;

    const items = fermentables.map((item) => ({
      label: item.name,
      value: item.id,
    }));

    return (
      <div className='uk-grid' data-uk-grid={true}>
        <div>
          <Input
            name='weight'
            type='number'
            required={true}
            onChange={this.handleChange}
            step={0.1}
            min={0}
            value={weight}
          />
        </div>
        <div>
          <Select name='unit'
                  onChange={this.handleChange}
                  options={[
                    { value: 'lbs', label: 'lbs' },
                    { value: 'oz', label: 'oz' },
                  ]}
                  value={unit}
          />
        </div>
        <div className='uk-width-expand'>
          <Form.AutoComplete
            debounced={true}
            items={items}
            name='id'
            selected={{ value: id, label: name }}
            onInputChange={this.handleInputChange}
            onSelect={this.handleSelect}
          />
        </div>
        <div className='uk-width-small'>
          <Button variation='danger' onClick={this.handleRemove}>Remove</Button>
        </div>
      </div>
    );
  }

  private handleRemove = () => {
   if (this.props.onRemove) {
     this.props.onRemove();
   }
  }

  private handleSelect = (item) => {
    if (this.props.onChange) {
      const fermentable = {
        ...this.props.fermentable,
        id: item.value,
        name: item.label,
      };

      this.props.onChange(fermentable);
    }
  }

  private handleChange: InputChangeHandlerType = (e, { name, value }) => {
      if (this.props.onChange) {
        const fermentable = {
          ...this.props.fermentable,
          [name]: value,
        };

        this.props.onChange(fermentable);
      }
  }

  private handleInputChange = (value: string) => {
    const { refetch } = this.props.fermentables;
    refetch({
      filter: {
        name: value,
      },
      limit: 15,
      sortBy: 'NAME',
    });
  }
}

export default withPagedQuery(GET_FERMENTABLES, (props) => {
  const options = {
    fetchPolicy: 'no-cache',
    name: 'fermentables',
    variables: {
      limit: 15,
      sortBy: 'NAME',
    },
  };

  if (props.fermentable.name) {
    options.variables.filter = {
      name: props.fermentable.name,
    };
  }

  return options;
})(FermentableInputRow);
