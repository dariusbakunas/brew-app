import { ApolloError } from 'apollo-client';
import path from 'path';
import React from 'react';
import { compose } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Button, Card, Container, Grid, IconNav, Spinner } from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';
import { getRecipes, IGetRecipesQuery, IRecipe, removeRecipe } from '../HOC/recipes';
import confirm from '../utils/confirm';

export interface IRecipesPageProps {
  getRecipes: IGetRecipesQuery;
  removeRecipe: (args: { variables: { id: string } }) => Promise<void>;
}

class RecipesPage extends React.Component<IRecipesPageProps & RouteComponentProps<{}>> {
  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    window.UIkit.notification({
      message: errorMessage,
      pos: 'top-right',
      status: 'danger',
      timeout: 5000,
    });
  }

  public componentDidMount(): void {
    const { location: { state = {} } } = this.props;
    if (state.recipeCreated) {
      this.props.getRecipes.refetch();
    }
  }

  public render() {
    const { loading, recipes = [] } = this.props.getRecipes;

    return (
      <Container>
        <h3>Recipes</h3>
        <Grid className='uk-child-width-1-3@l uk-child-width-1-2@m uk-child-width-1-1@s'>
          {
            recipes.map((recipe: IRecipe & { id: string }) => (
              <div key={recipe.id}>
                <Card hover={true}>
                  <Card.Header>
                    {recipe.name}
                  </Card.Header>
                  <Card.Body>
                    {recipe.description || 'No description'}
                  </Card.Body>
                  <Card.Footer>
                    <a href='#' className='uk-button uk-button-text'>Brew</a>
                    <IconNav className='uk-text-nowrap uk-float-right'>
                      <IconNav.Item icon='pencil' onClick={() => this.handleEditRecipe(recipe)}/>
                      <IconNav.Item icon='trash' onClick={() => this.handleRemoveRecipe(recipe)}/>
                    </IconNav>
                  </Card.Footer>
                </Card>
              </div>
            ))}
          <div className='uk-width-3-3'>
            <Button variation='primary' onClick={this.handleCreate}>New</Button>
          </div>
        </Grid>
        <Spinner active={loading}/>
      </Container>
    );
  }

  private handleEditRecipe = (recipe: IRecipe & { id: string }) => {
    const { pathname } = this.props.location;
    this.props.history.push(path.join(pathname, recipe.id));
  }

  private handleRemoveRecipe = ({ id, name }: IRecipe & { id: string }) => {
    confirm(`Are you sure you want to remove ${name}?`, () => {
      this.setState({ loading: true }, () => {
        this.props.removeRecipe({ variables: { id }})
          .then(() => this.setState({ loading: false }))
          .catch((err: ApolloError) => {
            this.setState({ loading: false }, () => {
              RecipesPage.handleError(err);
            });
          });
      });
    });
  }

  private handleCreate = () => {
    const { pathname } = this.props.location;
    this.props.history.push(path.join(pathname, 'create'));
  }
}

export default compose(
  getRecipes,
  removeRecipe,
)(withRouter(RecipesPage));
