import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import Form from '../components/Form';
import Modal from './Modal';
import Button from '../components/Button';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { CREATE_HOP, GET_ALL_HOPS, GET_ALL_COUNTRIES } from '../queries';

class HopModal extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    createHop: PropTypes.func.isRequired,
    getAllCountries: PropTypes.shape({
      loading: PropTypes.bool,
      countries: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      })),
    }),
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
    originId: '',
    validationErrors: null,
  });

  state = HopModal.getDefaultState();

  handleHide = () => {
    this.setState(HopModal.getDefaultState());
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = (e, closeModal) => {
    e.preventDefault();

    const { createHop } = this.props;

    this.setState({ loading: true }, () => {
      const {
        aaLow, aaHigh, betaLow, betaHigh, aroma, bittering, description, name, originId,
      } = this.state;

      createHop({
        variables: {
          input: {
            aaLow,
            aaHigh,
            aroma,
            betaLow,
            betaHigh,
            bittering,
            description,
            name,
            originId,
          },
        },
      }).then(() => {
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
    const { id, getAllCountries } = this.props;

    const {
      error, loading, aaLow, aaHigh, betaLow, betaHigh, aroma, bittering, description, name,
    } = this.state;

    return (
      <Modal
        id={id}
        error={error}
        loading={loading || getAllCountries.loading}
        header='New Hop'
        onHide={this.handleHide}
        render={close => (
          <Form onSubmit={e => this.handleSubmit(e, close)}>
            <Form.Fieldset layout='stacked'>
              <div className="uk-margin">
                <Form.Input
                  disabled={loading}
                  label='Name'
                  name='name'
                  onChange={this.handleChange}
                  value={name}
                  required
                />
              </div>
              <div className="uk-margin">
                <Form.Select
                  name='originId'
                  onChange={this.handleChange}
                  options={
                    getAllCountries.countries.map(
                      country => ({ value: country.id, label: country.name }),
                    )}
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
)(HopModal);
