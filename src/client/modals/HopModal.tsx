import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { Hop, HopInput, ICountry } from '../../types';
import { Button, Form } from '../components';
import { InputChangeHandlerType } from '../components/Form/Input';
import handleGrpahQLError from '../errors/handleGraphQLError';
import {
  CREATE_HOP, GET_ALL_COUNTRIES, UPDATE_HOP,
} from '../queries';
import Modal from './Modal';

// TODO: find a better way to do this
const UNITED_STATES_ID = '236';

interface IHopModalProps {
  id: string;
  createHop?: (args: { variables: HopInput }) => Promise<void>;
  getAllCountries: {
    loading: boolean,
    countries: ICountry[],
  };
  hop?: Hop & { id: string };
  onHide?: () => void;
  open?: boolean;
  refetchQuery?: any;
  updateHop?: (args: { variables: HopInput }) => Promise<void>;
}

type HopModalState = Hop & {
  error?: string,
  loading: boolean,
  originId: string,
  validationErrors: {
    [key: string]: string,
  },
};

export class HopModal extends React.Component<IHopModalProps> {
  private static getDefaultState: () => HopModalState = () => ({
    aaHigh: null,
    aaLow: null,
    aroma: false,
    betaHigh: null,
    betaLow: null,
    bittering: false,
    description: null,
    error: null,
    loading: false,
    name: null,
    originId: UNITED_STATES_ID,
    validationErrors: null,
  })

  public readonly state: HopModalState;

  constructor(props: IHopModalProps) {
    super(props);

    if (props.hop) {
      this.state = {
        ...props.hop,
        error: null,
        loading: false,
        originId: props.hop.origin.id,
        validationErrors: null,
      };
    } else {
      this.state = HopModal.getDefaultState();
    }
  }

  public componentDidUpdate(prevProps: IHopModalProps) {
    if (!prevProps.hop && this.props.hop) {
      this.setState({
        ...this.props.hop,
        error: null,
        loading: false,
        originId: this.props.hop.origin.id,
        validationErrors: null,
      });
    }
  }

  public render() {
    const {
      hop, id, getAllCountries, open,
    } = this.props;

    const {
      error, loading, aaLow, aaHigh, betaLow, betaHigh,
      aroma, bittering, description, name, originId, validationErrors,
    } = this.state;

    return (
      <Modal
        id={id}
        error={error}
        loading={loading || getAllCountries.loading}
        header={hop ? hop.name : 'New Hop'}
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
              <div className='uk-margin'>
                <Form.Select
                  error={validationErrors ? validationErrors.originId : null}
                  label='Origin'
                  name='originId'
                  value={originId}
                  onChange={this.handleChange}
                  options={
                    getAllCountries.countries ? getAllCountries.countries.map(
                      (country) => ({ value: country.id, label: country.name }),
                    ) : []}
                />
              </div>
              <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                <Form.Checkbox
                  checked={!!aroma}
                  disabled={loading}
                  label='Aroma'
                  name='aroma'
                  onChange={this.handleChange}
                />
                <Form.Checkbox
                  checked={!!bittering}
                  disabled={loading}
                  label='Bittering'
                  name='bittering'
                  onChange={this.handleChange}
                />
              </div>
              <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                <div>
                  <Form.Input
                    disabled={loading}
                    error={validationErrors ? validationErrors.aaLow : null}
                    icon='percent'
                    iconWidth='12px'
                    min={0}
                    max={100}
                    width='small'
                    type='number'
                    name='aaLow'
                    label='Alpha (low)'
                    onChange={this.handleChange}
                    step={0.1}
                    value={aaLow || ''}
                  />
                </div>
                <div>
                  <Form.Input
                    disabled={loading}
                    error={validationErrors ? validationErrors.aaHigh : null}
                    icon='percent'
                    iconWidth='12px'
                    min={0}
                    max={100}
                    width='small'
                    type='number'
                    name='aaHigh'
                    label='Alpha (high)'
                    onChange={this.handleChange}
                    step={0.1}
                    value={aaHigh || ''}
                  />
                </div>
              </div>
              <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                <div>
                  <Form.Input
                    disabled={loading}
                    error={validationErrors ? validationErrors.betaLow : null}
                    icon='percent'
                    iconWidth='12px'
                    min={0}
                    max={100}
                    width='small'
                    type='number'
                    name='betaLow'
                    label='Beta (low)'
                    onChange={this.handleChange}
                    step={0.1}
                    value={betaLow || ''}
                  />
                </div>
                <div>
                  <Form.Input
                    disabled={loading}
                    error={validationErrors ? validationErrors.betaHigh : null}
                    icon='percent'
                    iconWidth='12px'
                    min={0}
                    max={100}
                    width='small'
                    type='number'
                    name='betaHigh'
                    label='Beta (high)'
                    onChange={this.handleChange}
                    step={0.1}
                    value={betaHigh || ''}
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

    this.setState(HopModal.getDefaultState());
  }

  private handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>, closeModal: () => void) => {
    e.preventDefault();

    const { createHop, hop, updateHop } = this.props;

    this.setState({ loading: true }, () => {
      const {
        aaLow, aaHigh, betaLow, betaHigh, aroma, bittering, description, name, originId,
      } = this.state;

      const variables: HopInput = {
        input: {
          aaHigh,
          aaLow,
          aroma,
          betaHigh,
          betaLow,
          bittering,
          description,
          name,
          originId: originId !== '' ? originId : null,
        },
      };

      let fn = createHop;

      if (hop) {
        variables.id = hop.id;
        fn = updateHop;
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
  graphql(CREATE_HOP, {
    name: 'createHop',
    options: (props: IHopModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
  graphql(UPDATE_HOP, {
    name: 'updateHop',
    options: (props: IHopModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
)(HopModal);
