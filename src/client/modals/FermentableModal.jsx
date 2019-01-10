import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import Modal from './Modal';
import { Button, Form } from '../components';
import { GET_ALL_COUNTRIES, CREATE_FERMENTABLE, UPDATE_FERMENTABLE } from '../queries';
import handleGrpahQLError from '../errors/handleGraphQLError';

const UNITED_STATES_ID = 236;

class FermentableModal extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    createFermentable: PropTypes.func.isRequired,
    fermentable: PropTypes.shape({
      name: PropTypes.string,
      origin: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    }),
    getAllCountries: PropTypes.shape({
      loading: PropTypes.bool,
      countries: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      })),
    }),
    onHide: PropTypes.func,
    open: PropTypes.bool,
    refetchQuery: PropTypes.object,
    updateFermentable: PropTypes.func.isRequired,
  };

  static getDefaultState = () => ({
    category: 'GRAIN',
    color: null,
    description: null,
    error: null,
    loading: false,
    name: null,
    originId: UNITED_STATES_ID,
    potential: null,
    type: 'BASE',
    yield: null,
    validationErrors: null,
  });

  constructor(props) {
    super(props);
    if (props.fermentable) {
      this.state = {
        ...props.fermentable,
        originId: props.fermentable.origin.id,
        loading: false,
        error: null,
        validationErrors: null,
      };
    } else {
      this.state = FermentableModal.getDefaultState();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.fermentable && this.props.fermentable) {
      this.setState({
        ...this.props.fermentable,
        originId: this.props.fermentable.origin.id,
        loading: false,
        error: null,
        validationErrors: null,
      });
    }
  }

  handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }

    this.setState(FermentableModal.getDefaultState());
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleCategoryChange = (e, { value }) => {
    this.setState({
      category: value,
      type: value === 'GRAIN' ? 'BASE' : null,
    });
  };

  handleSubmit = (e, closeModal) => {
    e.preventDefault();

    const { createFermentable, fermentable, updateFermentable } = this.props;

    this.setState({ loading: true }, () => {
      const {
        category, color, description, name, originId, potential, type,
      } = this.state;

      const variables = {
        input: {
          category,
          color: color !== '' ? color : null,
          description,
          name,
          originId: originId !== '' ? originId : null,
          potential: potential !== '' ? potential : null,
          yield: this.state.yield,
          type,
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
      }).catch((err) => {
        const { validationErrors, errorMessage } = handleGrpahQLError(err, false);
        this.setState({
          error: errorMessage,
          loading: false,
          validationErrors,
        });
      });
    });
  };

  render() {
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
        render={close => (
          <Form onSubmit={e => this.handleSubmit(e, close)}>
            <Form.Fieldset layout='stacked'>
              <div className='uk-margin'>
                <Form.Input
                  disabled={loading}
                  error={validationErrors ? validationErrors.name : null}
                  label='Name'
                  name='name'
                  onChange={this.handleChange}
                  value={name || ''}
                  required
                />
              </div>
              <div className="uk-margin">
                <Form.Select
                  label='Origin'
                  error={validationErrors ? validationErrors.originId : null}
                  name='originId'
                  value={originId}
                  onChange={this.handleChange}
                  options={
                    getAllCountries.countries ? getAllCountries.countries.map(
                      country => ({ value: country.id, label: country.name }),
                    ) : []}
                />
              </div>
              <div className="uk-margin">
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
                <div className="uk-margin">
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
              <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
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
                    value={color || ''}
                    required
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
                    value={potential || ''}
                    required
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
                    value={this.state.yield || ''}
                    required
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
}

export default compose(
  graphql(GET_ALL_COUNTRIES, { name: 'getAllCountries' }),
  graphql(CREATE_FERMENTABLE, {
    name: 'createFermentable',
    options: props => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
  graphql(UPDATE_FERMENTABLE, {
    name: 'updateFermentable',
    options: props => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
)(FermentableModal);
