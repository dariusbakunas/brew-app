import { ApolloError } from 'apollo-client';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Button, Container, Form } from '../components';
import { InputChangeHandlerType } from '../components/Form/Input';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { CREATE_RECIPE } from '../queries';

interface IRecipe {
  name: string;
  description?: string;
  source?: string;
  batchSize: number;
  boilTime: number;
  type: 'ALL_GRAIN' | 'EXTRACT' | 'PARTIAL_MASH' | 'CIDER' | 'WINE' | 'MEAD';
}

interface IRecipeInput {
  id?: string;
  input: IRecipe;
}

interface INewRecipePageProps {
  recipe: any;
  createRecipe?: (args: { variables: IRecipeInput }) => Promise<void>;
}

interface INewRecipePageState {
  loading: boolean;
  validationErrors: {
    [key: string]: string,
  };
}

class NewRecipePage extends React.Component<INewRecipePageProps> {
  private static getDefaultState: () => INewRecipePageState & IRecipe = () => ({
    batchSize: 5.0,
    boilTime: 60,
    description: null,
    loading: false,
    name: null,
    source: null,
    type: 'ALL_GRAIN',
    validationErrors: null,
  })

  public readonly state: INewRecipePageState & IRecipe;

  constructor(props: INewRecipePageProps) {
    super(props);
    this.state = NewRecipePage.getDefaultState();
  }

  public render() {
    const { batchSize, boilTime, name, description, source, type } = this.state;

    return (
      <Container>
        <h3>New Recipe</h3>
        <Form onSubmit={(e) => this.handleSubmit(e)}>
          <ul uk-accordion='multiple: true'>
            <li className='uk-open'>
              <a className='uk-accordion-title' href='#'>General</a>
              <div className='uk-accordion-content'>
                <div className='uk-grid' uk-grid={true}>
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
                Fermentables
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
      </Container>
    );
  }

  private handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { createRecipe, recipe } = this.props;

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
        // TODO: finish recipe update
      }

      fn({ variables }).then(() => {
        this.setState({ loading: false }, () => {
          // go to recipes page?
        });
      }).catch((err: ApolloError) => {
        const { validationErrors, errorMessage } = handleGrpahQLError(err, false);
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
  graphql(CREATE_RECIPE, {
    name: 'createRecipe',
  }),
)(NewRecipePage);
