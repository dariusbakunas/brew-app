import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { Water, WaterInput } from '../../types';
import { Button, Form } from '../components';
import { InputChangeHandlerType } from '../components/Form/Input';
import handleGrpahQLError from '../errors/handleGraphQLError';
import {
  CREATE_WATER, UPDATE_WATER,
} from '../queries';
import Modal from './Modal';

interface IWaterModalProps {
  id: string;
  createWater: (args: { variables: WaterInput }) => Promise<void>;
  water: Water & { id: string };
  onHide: () => void;
  open: boolean;
  refetchQuery: any;
  updateWater: (args: { variables: WaterInput }) => Promise<void>;
}

type WaterModalState = Water & {
  error?: string,
  loading: boolean,
  validationErrors: {
    [key: string]: string,
  },
};

export class WaterModal extends React.Component<IWaterModalProps> {
  private static getDefaultState: () => WaterModalState = () => ({
    alkalinity: null,
    bicarbonate: null,
    calcium: null,
    chloride: null,
    description: null,
    error: null,
    loading: false,
    magnesium: null,
    name: null,
    pH: null,
    sodium: null,
    sulfate: null,
    validationErrors: null,
  })

  public readonly state: Readonly<WaterModalState>;

  constructor(props: IWaterModalProps) {
    super(props);
    if (props.water) {
      this.state = {
        ...props.water,
        error: null,
        loading: false,
        validationErrors: null,
      };
    } else {
      this.state = WaterModal.getDefaultState();
    }
  }

  public componentDidUpdate(prevProps: IWaterModalProps) {
    if (!prevProps.water && this.props.water) {
      this.setState({
        ...this.props.water,
        error: null,
        loading: false,
        validationErrors: null,
      });
    }
  }

  public render() {
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
                    required={true}
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
                    required={true}
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
                    required={true}
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
                    required={true}
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
                    required={true}
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
                    required={true}
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
                    required={true}
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

  private handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  private handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }

    this.setState(WaterModal.getDefaultState());
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>, closeModal: () => void) => {
    e.preventDefault();

    const { createWater, updateWater, water } = this.props;

    this.setState({ loading: true }, () => {
      const {
        name, description, pH, alkalinity, calcium, magnesium,
        sodium, sulfate, chloride, bicarbonate,
      } = this.state;

      const variables: WaterInput = {
        input: {
          alkalinity,
          bicarbonate,
          calcium,
          chloride,
          description,
          magnesium,
          name,
          pH,
          sodium,
          sulfate,
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
  }
}

export default compose(
  graphql(CREATE_WATER, {
    name: 'createWater',
    options: (props: IWaterModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
  graphql(UPDATE_WATER, {
    name: 'updateWater',
    options: (props: IWaterModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
)(WaterModal);
