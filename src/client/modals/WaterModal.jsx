import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import Modal from './Modal';
import { Button, Form } from '../components';
import handleGrpahQLError from '../errors/handleGraphQLError';
import {
  CREATE_WATER, UPDATE_WATER,
} from '../queries';

class WaterModal extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    createWater: PropTypes.func.isRequired,
    water: PropTypes.shape({
      name: PropTypes.string,
    }),
    onHide: PropTypes.func,
    open: PropTypes.bool,
    refetchQuery: PropTypes.object,
    updateWater: PropTypes.func.isRequired,
  };

  static getDefaultState = () => ({
    name: null,
    pH: null,
    alkalinity: null,
    calcium: null,
    magnesium: null,
    sodium: null,
    sulfate: null,
    chloride: null,
    bicarbonate: null,
    description: null,
    error: null,
    loading: false,
    validationErrors: null,
  });

  constructor(props) {
    super(props);
    if (props.water) {
      this.state = {
        ...props.water,
        loading: false,
        error: null,
        validationErrors: null,
      };
    } else {
      this.state = WaterModal.getDefaultState();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.water && this.props.water) {
      this.setState({
        ...this.props.water,
        loading: false,
        error: null,
        validationErrors: null,
      });
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }

    this.setState(WaterModal.getDefaultState());
  };

  handleSubmit = (e, closeModal) => {
    e.preventDefault();

    const { createWater, updateWater, water } = this.props;

    this.setState({ loading: true }, () => {
      const {
        name, description, pH, alkalinity, calcium, magnesium,
        sodium, sulfate, chloride, bicarbonate,
      } = this.state;

      const variables = {
        input: {
          name,
          pH,
          alkalinity,
          calcium,
          magnesium,
          sodium,
          sulfate,
          chloride,
          bicarbonate,
          description,
        },
      };

      let fn = createWater;

      if (water) {
        variables.id = water.id;
        fn = updateWater;
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
      water, id, open,
    } = this.props;

    const {
      error, validationErrors, name, loading, description, pH, alkalinity, calcium,
      magnesium, sodium, chloride, sulfate, bicarbonate,
    } = this.state;

    return (
      <Modal
        error={error}
        header={water ? water.name : 'New Water'}
        id={id}
        loading={loading}
        onHide={this.handleHide}
        open={open}
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
              <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                <div>
                  <Form.Input
                    disabled={loading}
                    min={1}
                    max={14}
                    width='small'
                    type='number'
                    name='pH'
                    label='pH'
                    onChange={this.handleChange}
                    step={0.01}
                    value={pH || ''}
                    required
                  />
                </div>
                <div>
                  <Form.Input
                    disabled={loading}
                    min={0}
                    max={1000}
                    width='small'
                    type='number'
                    name='alkalinity'
                    label='Alkalinity (CaCO&#8323;)'
                    onChange={this.handleChange}
                    step={1}
                    value={alkalinity || ''}
                    required
                  />
                </div>
              </div>
              <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                <div>
                  <Form.Input
                    disabled={loading}
                    min={0}
                    max={1000}
                    width='small'
                    type='number'
                    name='calcium'
                    label='Calcium (Ca)'
                    onChange={this.handleChange}
                    step={0.01}
                    value={calcium || ''}
                    required
                  />
                </div>
                <div>
                  <Form.Input
                    disabled={loading}
                    min={0}
                    max={1000}
                    width='small'
                    type='number'
                    name='magnesium'
                    label='Magnesium (Mg)'
                    onChange={this.handleChange}
                    step={0.01}
                    value={magnesium || ''}
                    required
                  />
                </div>
                <div>
                  <Form.Input
                    disabled={loading}
                    min={0}
                    max={1000}
                    width='small'
                    type='number'
                    name='sodium'
                    label='Sodium (Na)'
                    onChange={this.handleChange}
                    step={0.01}
                    value={sodium || ''}
                    required
                  />
                </div>
              </div>
              <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                <div>
                  <Form.Input
                    disabled={loading}
                    min={0}
                    max={1000}
                    width='small'
                    type='number'
                    name='sulfate'
                    label='Sulfate (SO&#8323;&#8322;)'
                    onChange={this.handleChange}
                    step={0.01}
                    value={sulfate || ''}
                    required
                  />
                </div>
                <div>
                  <Form.Input
                    disabled={loading}
                    min={0}
                    max={1000}
                    width='small'
                    type='number'
                    name='chloride'
                    label='Chloride (Cl)'
                    onChange={this.handleChange}
                    step={0.01}
                    value={chloride || ''}
                    required
                  />
                </div>
                <div>
                  <Form.Input
                    disabled={loading}
                    min={0}
                    max={1000}
                    width='small'
                    type='number'
                    name='bicarbonate'
                    label='Bicarbonate (HCO&#8323;)'
                    onChange={this.handleChange}
                    step={0.01}
                    value={bicarbonate || ''}
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
  graphql(CREATE_WATER, {
    name: 'createWater',
    options: props => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
  graphql(UPDATE_WATER, {
    name: 'updateWater',
    options: props => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
)(WaterModal);
