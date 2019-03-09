import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import {
  Fermentable, FermentableCategory, FermentableInput, GrainType, ICountry,
} from '../../types';
import { Button, Form } from '../components';
import { InputChangeHandlerType } from '../components/Form/Input';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { CREATE_FERMENTABLE, GET_ALL_COUNTRIES, UPDATE_FERMENTABLE } from '../queries';
import Modal from './Modal';

const UNITED_STATES_ID = '236';

interface IFermentableModalProps {
  id: string;
  createFermentable: (args: { variables: FermentableInput }) => Promise<void>;
  fermentable: Fermentable & { id: string };
  getAllCountries: {
    loading: boolean,
    countries: ICountry[],
  };
  onHide: () => void;
  open: boolean;
  refetchQuery: any;
  updateFermentable: (args: { variables: FermentableInput }) => Promise<void>;
}

type FermentbaleModalState = Fermentable & {
  error?: string,
  loading: boolean,
  originId: string,
  validationErrors: {
    [key: string]: string,
  },
};

export class FermentableModal extends React.Component<IFermentableModalProps> {
  private static getDefaultState: () => FermentbaleModalState = () => ({
    category: FermentableCategory.GRAIN,
    color: null,
    description: null,
    error: null,
    loading: false,
    name: null,
    originId: UNITED_STATES_ID,
    potential: null,
    type: GrainType.BASE,
    validationErrors: null,
    yield: null,
  })

  public readonly state: Readonly<FermentbaleModalState>;

  constructor(props: IFermentableModalProps) {
    super(props);
    if (props.fermentable) {
      this.state = {
        ...props.fermentable,
        error: null,
        loading: false,
        originId: props.fermentable.origin.id,
        validationErrors: null,
      };
    } else {
      this.state = FermentableModal.getDefaultState();
    }
  }

  public componentDidUpdate(prevProps: IFermentableModalProps) {
    if (!prevProps.fermentable && this.props.fermentable) {
      this.setState({
        ...this.props.fermentable,
        error: null,
        loading: false,
        originId: this.props.fermentable.origin.id,
        validationErrors: null,
      });
    }
  }

  public render() {
    const {
      fermentable, id, getAllCountries, open,
    } = this.props;

    const {
      category, color, description, error, loading, name, originId, potential,
      type, validationErrors,
    } = this.state;

    const categories = [
      { value: 'DRY_EXTRACT', label: 'Dry Extract' },
      { value: 'FRUIT', label: 'Fruit' },
      { value: 'GRAIN', label: 'Grain' },
      { value: 'JUICE', label: 'Juice' },
      { value: 'LIQUID_EXTRACT', label: 'Liquid Extract' },
      { value: 'SUGAR', label: 'Sugar' },
    ];

    const types = [
      { value: 'BASE', label: 'Base' },
      { value: 'COLOR', label: 'Color' },
      { value: 'CARAMEL_CRYSTAL', label: 'Caramel & Crystal' },
      { value: 'ROASTED', label: 'Roasted' },
      { value: 'ADJUNCT', label: 'Adjunct' },
      { value: 'SPECIALTY', label: 'Specialty' },
    ];

    return (
      <Modal
        error={error}
        loading={loading}
        header={fermentable ? fermentable.name : 'New Fermentable'}
        onHide={this.handleHide}
        open={open}
        id={id}
        render={(close) => (
          <Form onSubmit={(e) => this.handleSubmit(e, close)}>
            <Form.Fieldset layout='stacked'>
              <div className='uk-margin'>
                <Form.Input
                  disabled={loading}
                  error={validationErrors ? validationErrors.name : null}
                  label='Name'
                  name='name'
                  onChange={this.handleChange}
                  value={name || ''}
                  required={true}
                />
              </div>
              <div className='uk-margin'>
                <Form.Select
                  label='Origin'
                  error={validationErrors ? validationErrors.originId : null}
                  name='originId'
                  value={originId}
                  onChange={this.handleChange}
                  options={
                    getAllCountries.countries ? getAllCountries.countries.map(
                      (country) => ({ value: country.id, label: country.name }),
                    ) : []}
                />
              </div>
              <div className='uk-margin'>
                <Form.Select
                  label='Category'
                  error={validationErrors ? validationErrors.category : null}
                  name='category'
                  value={category}
                  onChange={this.handleCategoryChange}
                  options={categories}
                />
              </div>
              {
                (!category || (category === 'GRAIN')) &&
                <div className='uk-margin'>
                  <Form.Select
                    label='Type'
                    error={validationErrors ? validationErrors.type : null}
                    name='type'
                    value={type || 'BASE'}
                    onChange={this.handleChange}
                    options={types}
                  />
                </div>
              }
              <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                <div>
                  <Form.Input
                    disabled={loading}
                    min={0}
                    max={1000}
                    width='small'
                    type='number'
                    name='color'
                    label='Color, °L'
                    onChange={this.handleChange}
                    step={0.1}
                    value={color !== null ? color : ''}
                    required={true}
                  />
                </div>
                <div>
                  <Form.Input
                    disabled={loading}
                    min={0}
                    max={2000}
                    width='small'
                    type='number'
                    name='potential'
                    label='Potential, SG'
                    onChange={this.handleChange}
                    step={0.001}
                    value={potential !== null ? potential : ''}
                    required={true}
                  />
                </div>
                <div>
                  <Form.Input
                    disabled={loading}
                    min={0}
                    max={100}
                    width='small'
                    type='number'
                    name='yield'
                    label='Yield, %'
                    onChange={this.handleChange}
                    step={0.01}
                    value={this.state.yield !== null ? this.state.yield : ''}
                    required={true}
                  />
                </div>
              </div>
              <Form.TextArea
                disabled={loading}
                name='description'
                label='Description'
                onChange={this.handleChange}
                value={description || ''}
              />
            </Form.Fieldset>
            <div className='uk-text-right'>
              <Button className='uk-modal-close uk-margin-small-right' disabled={loading}>Cancel</Button>
              <Button variation='primary' type='submit' disabled={loading}>Submit</Button>
            </div>
          </Form>
        )}
      />
    );
  }

  private handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }

    this.setState(FermentableModal.getDefaultState());
  }

  private handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  private handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    { value }: { name: string, value: FermentableCategory },
  ) => {
    this.setState({
      category: value,
      type: value === FermentableCategory.GRAIN ? GrainType.BASE : null,
    });
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>, closeModal: () => void) => {
    e.preventDefault();

    const { createFermentable, fermentable, updateFermentable } = this.props;

    this.setState({ loading: true }, () => {
      const {
        category, color, description, name, originId, potential, type,
      } = this.state;

      const variables: FermentableInput = {
        input: {
          category,
          color,
          description,
          name,
          originId: originId !== '' ? originId : null,
          potential,
          type,
          yield: this.state.yield,
        },
      };

      let fn = createFermentable;

      if (fermentable) {
        variables.id = fermentable.id;
        fn = updateFermentable;
      }

      fn({ variables }).then(() => {
        this.setState({ loading: false }, () => {
          closeModal();
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
  graphql(GET_ALL_COUNTRIES, { name: 'getAllCountries' }),
  graphql(CREATE_FERMENTABLE, {
    name: 'createFermentable',
    options: (props: IFermentableModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
  graphql(UPDATE_FERMENTABLE, {
    name: 'updateFermentable',
    options: (props: IFermentableModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
)(FermentableModal);
