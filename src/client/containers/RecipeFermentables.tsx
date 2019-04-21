import gql from 'graphql-tag';
import React from 'react';
import { graphql } from 'react-apollo';
import { Form } from '../components';

const GET_FERMENTABLES = gql`
  query GetFermentables(
  $cursor: String,
  $limit: Int,
  $sortBy: SortableFermentableField,
  $sortDirection: SortDirection) {
    fermentables(
      cursor: $cursor,
      limit: $limit,
      sortBy: $sortBy,
      sortDirection: $sortDirection) @connection(key: "fermentables") {
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

interface IRecipeFermentablesProps {
  getFermentables: {
    fermentables?: {
      data: Array<{
        id: string,
        name: string,
      }>,
      pageInfo: {
        nextCursor?: string,
      },
    }
    loading: boolean,
  };
}

class RecipeFermentables extends React.Component<IRecipeFermentablesProps> {
  public render() {
    const { fermentables: { data: fermentables = [] } = {} } = this.props.getFermentables;

    const items = fermentables.map((fermentable) => ({
      label: fermentable.name,
      value: fermentable.id,
    }));

    return (
      <Form.AutoComplete items={items}/>
    );
  }
}

export default graphql<IRecipeFermentablesProps>(GET_FERMENTABLES, {
  name: 'getFermentables',
  options: (props) => ({
    variables: {
      limit: 15,
      sortBy: 'NAME',
    },
  }),
})(RecipeFermentables);
