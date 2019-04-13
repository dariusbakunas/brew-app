import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { IRecipe } from '../../types';

const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      name
      description
      type
      createdBy {
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

interface IRemoveRecipeResponse {
  removeRecipe: string;
}

export interface IGetRecipesQuery {
  loading: boolean;
  recipes: Array<IRecipe & { id: string }>;
}

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
