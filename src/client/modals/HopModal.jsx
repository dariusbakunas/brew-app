import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import Form from '../components/Form';
import Modal from './Modal';
import Button from '../components/Button';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { CREATE_HOP, GET_ALL_HOPS, GET_ALL_COUNTRIES, UPDATE_HOP } from '../queries';

// TODO: find a better way to do this
const UNITED_STATES_ID = 236;

class HopModal extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    createHop: PropTypes.func.isRequired,
    hop: PropTypes.shape({
      aaLow: PropTypes.number,
      aaHigh: PropTypes.number,
      aroma: PropTypes.bool,
      bittering: PropTypes.bool,
      betaLow: PropTypes.number,
      betaHigh: PropTypes.number,
      description: PropTypes.string,
      name: PropTypes.string,
      origin: PropTypes.shape({
        id: PropTypes.string,
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
    updateHop: PropTypes.func,
  };

  static getDefaultState = () => ({
    aaLow: '',
    aaHigh: '',
    betaLow: '',
    betaHigh: '',
    aroma: false,
    bittering: false,
    description: '',
    error: null,
    loading: false,
    name: '',
    originId: UNITED_STATES_ID,
    validationErrors: null,
  });

  constructor(props) {
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

  componentDidUpdate(prevProps) {
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

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = (e, closeModal) => {
    e.preventDefault();

    const { createHop, hop, updateHop } = this.props;

    this.setState({ loading: true }, () => {
      const {
        aaLow, aaHigh, betaLow, betaHigh, aroma, bittering, description, name, originId,
      } = this.state;

      const variables = {
        input: {
          aaLow: aaLow !== '' ? aaLow : null,
          aaHigh: aaHigh !== '' ? aaHigh : null,
          aroma,
          betaLow: betaLow !== '' ? betaLow : null,
          betaHigh: betaHigh !== '' ? betaHigh : null,
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
                  value={name}
                  required
                />
              </div>
              <div className="uk-margin">
                <Form.Select
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
              <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                <Form.Checkbox
                  checked={aroma}
                  disabled={loading}
                  label='Aroma'
                  name='aroma'
                  onChange={this.handleChange}
                />
                <Form.Checkbox
                  checked={bittering}
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
                    value={aaLow}
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
                    value={aaHigh}
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
                    value={betaLow}
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
                    value={betaHigh}
                  />
                </div>
              </div>
              <Form.TextArea
                disabled={loading}
                name='description'
                label='Description'
                onChange={this.handleChange}
                value={description}
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
    options: {
      update: (cache, { data: { createHop } }) => {
        const { hops } = cache.readQuery({ query: GET_ALL_HOPS });
        cache.writeQuery({
          query: GET_ALL_HOPS,
          data: { hops: [...hops, createHop] },
        });
      },
    },
  }),
  graphql(UPDATE_HOP, {
    name: 'updateHop',
    options: {
      update: (cache, { data: { updateHop } }) => {
        const { hops } = cache.readQuery({ query: GET_ALL_HOPS });

        const idx = hops.findIndex(hop => hop.id === updateHop.id);
        hops.splice(idx, 1, updateHop);

        cache.writeQuery({
          query: GET_ALL_HOPS,
          data: { hops },
        });
      },
    },
  }),
)(HopModal);
