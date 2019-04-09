import path from 'path';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { IRecipe } from '../../types';
import { Button, Card, Container, Grid, IconNav, Spinner } from '../components';
import { GET_RECIPES } from '../queries';

interface IRecipesPageProps {
  data: {
    loading: boolean,
    recipes: Array<IRecipe & { id: string }>,
  };
}

class RecipesPage extends React.Component<IRecipesPageProps & RouteComponentProps<{}>> {
  public render() {
    const { loading, recipes = [] } = this.props.data;

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

  private handleRemoveRecipe = (recipe: IRecipe) => {
    console.log(recipe);
  }

  private handleCreate = () => {
    const { pathname } = this.props.location;
    this.props.history.push(path.join(pathname, 'create'));
  }
}

export default compose(
  graphql(GET_RECIPES),
)(withRouter(RecipesPage));
