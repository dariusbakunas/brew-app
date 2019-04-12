import { graphql } from 'react-apollo';
import { IRecipe } from '../../types';
import { GET_RECIPES, REMOVE_RECIPE } from '../queries';

interface IRemoveRecipeResponse {
  removeRecipe: string;
}

export interface IGetRecipesQuery {
  loading: boolean;
  recipes: Array<IRecipe & { id: string }>;
}

export const getRecipes = graphql<IGetRecipesQuery>(GET_RECIPES);

export const removeRecipe = graphql<{}, IRemoveRecipeResponse, {}>(REMOVE_RECIPE, {
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
