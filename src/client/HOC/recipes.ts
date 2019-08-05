import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      name
      description
      type
      createdBy {
        id
        username
      }
    }
  }
`;

const REMOVE_RECIPE = gql`
  mutation RemoveRecipe($id: ID!) {
    removeRecipe(id: $id)
  }
`;

const GET_RECIPE = gql`
  query GetRecipe($id: ID!) {
    recipe(id: $id) {
      id
      batchSize
      boilTime
      description
      fermentables {
        amount
        id
        name
        unit
      }
      name
      type
      source
    }
  }
`;

export const CREATE_RECIPE = gql`
  mutation CreateRecipe($input: RecipeInput!) {
    createRecipe(input: $input) {
      id
      batchSize
      boilTime
      createdBy {
        id
        username
      }
      fermentables {
        amount
        id
        name
        unit
      }
      name
      description
      source
      type
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($id: ID!, $input: RecipeInput!) {
    updateRecipe(id: $id, input: $input) {
      id
      batchSize
      boilTime
      createdBy {
        id
        username
      }
      fermentables {
        amount
        id
        name
        unit
      }
      name
      description
      source
      type
    }
  }
`;

export interface IRecipeFermentable {
  id: string;
  name: string;
  unit: string;
  amount: number;
}

export interface IRecipe {
  name: string;
  description?: string;
  source?: string;
  batchSize: number;
  boilTime: number;
  fermentables: IRecipeFermentable[];
  type: 'ALL_GRAIN' | 'EXTRACT' | 'PARTIAL_MASH' | 'CIDER' | 'WINE' | 'MEAD';
}

export interface IRecipeInput {
  id?: string;
  input: {
    name: string;
    description?: string;
    source?: string;
    batchSize: number;
    boilTime: number;
    fermentables: Array<{
      id: string;
      unit: string;
      amount: number;
    }>;
    type: 'ALL_GRAIN' | 'EXTRACT' | 'PARTIAL_MASH' | 'CIDER' | 'WINE' | 'MEAD';
  };
}

interface IRemoveRecipeResponse {
  removeRecipe: string;
}

export interface IGetRecipesQuery {
  loading: boolean;
  recipes: Array<IRecipe & { id: string }>;
  refetch: () => Promise<void>;
}

export const getRecipeQuery = graphql<{ match: { params: { id: string } } }>(GET_RECIPE, {
  name: 'getRecipe',
  // TODO: make options an argument, so that each component could use props differently
  options: (props) => ({
    variables: {
      id: props.match.params.id,
    },
  }),
  skip: (props) => props.match.params.id === 'create',
});

export const getRecipes = graphql<any, IGetRecipesQuery>(GET_RECIPES, { name: 'getRecipes' });

export const removeRecipe = graphql<any, IRemoveRecipeResponse>(REMOVE_RECIPE, {
  name: 'removeRecipe',
  options: {
    update: (cache, { data: { removeRecipe: id } }) => {
      const { recipes } = cache.readQuery<IGetRecipesQuery>({ query: GET_RECIPES });

      cache.writeQuery({
        data: {
          recipes: recipes.filter((recipe: IRecipe & { id: string }) => recipe.id !== id),
        },
        query: GET_RECIPES,
      });
    },
  },
});
