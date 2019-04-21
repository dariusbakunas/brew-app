import { ApolloError } from 'apollo-client';
import { History } from 'history';
import LocationState = History.LocationState;
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { StaticContext, withRouter } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';
import { IRecipe } from '../../types';
import { Button, Container, Form, Spinner } from '../components';
import { InputChangeHandlerType } from '../components/Form/Input';
import RecipeFermentables from '../containers/RecipeFermentables';
import handleGraphQLError from '../errors/handleGraphQLError';
import { getRecipeQuery } from '../HOC/recipes';
import { CREATE_RECIPE, UPDATE_RECIPE } from '../queries';

interface IRecipeInput {
  id?: string;
  input: IRecipe;
}

interface IEditRecipePageProps {
  recipe: any;
  createRecipe?: (args: { variables: IRecipeInput }) => Promise<void>;
  updateRecipe?: (args: { variables: IRecipeInput }) => Promise<void>;
  getRecipe: {
    loading: boolean,
    recipe?: IRecipe & { id: string },
  };
}

interface IEditRecipePageState {
  loading: boolean;
  validationErrors: {
    [key: string]: string,
  };
}

class EditRecipePage extends React.Component<IEditRecipePageProps & RouteComponentProps> {
  private static getInitialState: (recipe: IRecipe & { id: string }) => IEditRecipePageState & IRecipe = (recipe) => {
    const defaultRecipe: IRecipe = {
      batchSize: 5.0,
      boilTime: 60,
      description: null,
      name: null,
      source: null,
      type: 'ALL_GRAIN',
    };

    return {
      ...(recipe || defaultRecipe),
      loading: false,
      validationErrors: null,
    };
  }

  public readonly state: IEditRecipePageState & IRecipe;

  constructor(props: IEditRecipePageProps & RouteComponentProps) {
    super(props);
    this.state = EditRecipePage.getInitialState(props.getRecipe ? props.getRecipe.recipe : null);
  }

  public componentDidUpdate(
    prevProps: Readonly<IEditRecipePageProps & RouteComponentProps<{}, StaticContext, LocationState>>,
    prevState: Readonly<{}>, snapshot?: any): void {
    const prevRecipe = prevProps.getRecipe ? prevProps.getRecipe.recipe : null;
    const currentRecipe = this.props.getRecipe ? this.props.getRecipe.recipe : null;

    if (prevRecipe !== currentRecipe) {
      this.setState({
        ...this.props.getRecipe.recipe,
      });
    }
  }

  public render() {
    const { loading: recipeLoading = false, recipe = null } = {...this.props.getRecipe};
    const { loading: recipeSaving } = this.state;
    const loading = recipeLoading || recipeSaving;
    const { batchSize, boilTime, name, description, source, type } = this.state;

    return (
      <Container>
        <h3>{recipe ? recipe.name : 'New Recipe'}</h3>
        <ul className='uk-breadcrumb'>
          <li><Link to='/recipes'>Recipes</Link></li>
          <li><span>{recipe ? 'Edit' : 'Create'}</span></li>
        </ul>
        <Form onSubmit={(e) => this.handleSubmit(e)} className='uk-margin'>
          <ul uk-accordion='multiple: true'>
            <li className='uk-open'>
              <a className='uk-accordion-title' href='#'>General</a>
              <div className='uk-accordion-content'>
                <div className='uk-grid' data-uk-grid={true}>
                  <div className='uk-width-1-2'>
                    <Form.Input
                      label='Name'
                      name='name'
                      onChange={this.handleChange}
                      required={true}
                      value={name || ''}
                    />
                  </div>
                  <div className='uk-width-1-2'>
                    <Form.Input
                      label='Author/Source'
                      name='source'
                      onChange={this.handleChange}
                      required={true}
                      value={source || ''}
                    />
                  </div>
                  <div className='uk-width-1-6 uk-margin'>
                    <Form.Select
                      label='Type'
                      name='type'
                      onChange={this.handleChange}
                      options={[
                        { value: 'ALL_GRAIN', label: 'All Grain' },
                        { value: 'EXTRACT', label: 'Extract' },
                        { value: 'MEAD', label: 'Mead' },
                        { value: 'WINE', label: 'Wine' },
                      ]}
                      value={type}
                    />
                  </div>
                  <div className='uk-width-1-6 uk-margin'>
                    <Form.Input
                      label='Batch Size, gal'
                      name='batchSize'
                      onChange={this.handleChange}
                      step={0.1}
                      type='number'
                      value={batchSize}
                    />
                  </div>
                  <div className='uk-width-1-6 uk-margin'>
                    <Form.Input
                      label='Boil time, min'
                      min={0}
                      name='boilTime'
                      onChange={this.handleChange}
                      step={0.1}
                      type='number'
                      value={boilTime}
                    />
                  </div>
                  <div className='uk-width-3-6'>
                  </div>
                  <div className='uk-width-expand uk-margin'>
                    <Form.TextArea
                      name='description'
                      label='Description'
                      onChange={this.handleChange}
                      value={description || ''}
                    />
                  </div>
                </div>
              </div>
            </li>
            <li>
              <a className='uk-accordion-title' href='#'>Fermentables</a>
              <div className='uk-accordion-content'>
                <RecipeFermentables/>
              </div>
            </li>
            <li>
              <a className='uk-accordion-title' href='#'>Hops</a>
              <div className='uk-accordion-content'>
                Hops
              </div>
            </li>
            <li>
              <a className='uk-accordion-title' href='#'>Water</a>
              <div className='uk-accordion-content'>
                Water
              </div>
            </li>
            <li>
              <a className='uk-accordion-title' href='#'>Yeast</a>
              <div className='uk-accordion-content'>
                Water
              </div>
            </li>
            <li>
              <a className='uk-accordion-title' href='#'>Mash</a>
              <div className='uk-accordion-content'>
                Mash
              </div>
            </li>
          </ul>
          <div className='uk-margin'>
            <Button variation='primary' type='submit'>Submit</Button>
          </div>
        </Form>
        <Spinner active={loading}/>
      </Container>
    );
  }

  private handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { createRecipe, updateRecipe } = this.props;
    const { recipe } = {...this.props.getRecipe};

    this.setState({ loading: true }, () => {
      const {
        name, description, boilTime, batchSize, type, source,
      } = this.state;

      const variables: IRecipeInput = {
        input: {
          batchSize,
          boilTime,
          description,
          name,
          source,
          type,
        },
      };

      let fn = createRecipe;

      if (recipe) {
        variables.id = recipe.id;
        fn = updateRecipe;
      }

      fn({ variables }).then(() => {
        this.setState({ loading: false }, () => {
          this.props.history.push('/recipes');
        });
      }).catch((err: ApolloError) => {
        const { validationErrors, errorMessage } = handleGraphQLError(err, false);
        this.setState({
          error: errorMessage,
          loading: false,
          validationErrors,
        });
      });
    });
  }
}

export default compose(
  getRecipeQuery,
  graphql(CREATE_RECIPE, {
    name: 'createRecipe',
  }),
  graphql(UPDATE_RECIPE, {
    name: 'updateRecipe',
  }),
)(withRouter(EditRecipePage));
