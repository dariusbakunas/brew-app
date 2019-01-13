import React from 'react';
import { compose, graphql } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import Modal from './Modal';
import { Button, Form } from '../components';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { InputChangeHandlerType } from '../components/Form/Input';
import { Country } from '../../types';
import {
  CREATE_HOP, GET_ALL_COUNTRIES, UPDATE_HOP,
} from '../queries';

// TODO: find a better way to do this
const UNITED_STATES_ID = '236';

type BaseHop = {
  aaLow?: number,
  aaHigh?: number,
  aroma: boolean,
  bittering: boolean,
  betaLow?: number,
  betaHigh?: number,
  description: string,
  name: string,
};

type Hop = BaseHop & {
  id?: string,
  origin: {
    id: string,
    name: string,
  }
};

type HopInput = { input: BaseHop } & { id?: string, input: { originId: string } };

type HopModalProps = {
  id: string,
  createHop: (args: { variables: HopInput }) => Promise<void>,
  getAllCountries: {
    loading: boolean,
    countries: Country[],
  },
  hop: Hop,
  onHide: () => void,
  open: boolean,
  refetchQuery: any,
  updateHop: (args: { variables: HopInput }) => Promise<void>,
};

type HopModalState = BaseHop & {
  error?: string,
  loading: boolean,
  originId: string,
  validationErrors: {
    [key: string]: string,
  }
};

class HopModal extends React.Component<HopModalProps> {
  readonly state: HopModalState;

  static getDefaultState: () => HopModalState = () => ({
    aaLow: null,
    aaHigh: null,
    aroma: false,
    bittering: false,
    betaLow: null,
    betaHigh: null,
    description: null,
    name: null,
    error: null,
    loading: false,
    originId: UNITED_STATES_ID,
    validationErrors: null,
  });

  constructor(props: HopModalProps) {
    super(props);

    if (props.hop) {
      this.state = {
        ...props.hop,
        originId: props.hop.origin.id,
        loading: false,
        error: null,
        validationErrors: null,
      };
    } else {
      this.state = HopModal.getDefaultState();
    }
  }

  componentDidUpdate(prevProps: HopModalProps) {
    if (!prevProps.hop && this.props.hop) {
      this.setState({
        ...this.props.hop,
        originId: this.props.hop.origin.id,
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

    this.setState(HopModal.getDefaultState());
  };

  handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = (e: React.FormEvent<HTMLFormElement>, closeModal: () => void) => {
    e.preventDefault();

    const { createHop, hop, updateHop } = this.props;

    this.setState({ loading: true }, () => {
      const {
        aaLow, aaHigh, betaLow, betaHigh, aroma, bittering, description, name, originId,
      } = this.state;

      const variables: HopInput = {
        input: {
          aaLow,
          aaHigh,
          aroma,
          betaLow,
          betaHigh,
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
  };

  render() {
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
        render={close => (
          <Form onSubmit={e => this.handleSubmit(e, close)}>
            <Form.Fieldset layout='stacked'>
              <div className="uk-margin">
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
                  error={validationErrors ? validationErrors.originId : null}
                  label='Origin'
                  name='originId'
                  value={originId}
                  onChange={this.handleChange}
                  options={
                    getAllCountries.countries ? getAllCountries.countries.map(
                      country => ({ value: country.id, label: country.name }),
                    ) : []}
                />
              </div>
              <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
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
              <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
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
              <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
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
}

export default compose(
  graphql(GET_ALL_COUNTRIES, { name: 'getAllCountries' }),
  graphql(CREATE_HOP, {
    name: 'createHop',
    options: (props: HopModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
  graphql(UPDATE_HOP, {
    name: 'updateHop',
    options: (props: HopModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
)(HopModal);
