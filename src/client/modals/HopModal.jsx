import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Form from '../components/Form';
import Modal from './Modal';
import Button from '../components/Button';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { CREATE_HOP, GET_ALL_HOPS } from '../queries';

class HopModal extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    mutate: PropTypes.func.isRequired,
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
    validationErrors: null,
  });

  state = HopModal.getDefaultState();

  handleHide = () => {
    this.setState(HopModal.getDefaultState());
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = (e, closeModal) => {
    e.preventDefault();

    const { mutate } = this.props;

    this.setState({ loading: true }, () => {
      const {
        aaLow, aaHigh, betaLow, betaHigh, aroma, bittering, description, name,
      } = this.state;

      mutate({
        variables: {
          aaLow,
          aaHigh,
          betaLow,
          betaHigh,
          aroma,
          bittering,
          description,
          name,
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
    const { id } = this.props;

    const {
      error, loading, aaLow, aaHigh, betaLow, betaHigh, aroma, bittering, description, name,
    } = this.state;

    return (
      <Modal
        id={id}
        error={error}
        loading={loading}
        header='New Hop'
        onHide={this.handleHide}
        render={close => (
          <Form onSubmit={e => this.handleSubmit(e, close)}>
            <Form.Fieldset layout='stacked'>
              <Form.Input
                disabled={loading}
                label='Name'
                name='name'
                onChange={this.handleChange}
                value={name}
                required
              />
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

export default graphql(CREATE_HOP, {
  options: {
    update: (cache, { data: { createHop } }) => {
      const { hops } = cache.readQuery({ query: GET_ALL_HOPS });
      cache.writeQuery({
        query: GET_ALL_HOPS,
        data: { hops: [...hops, createHop] },
      });
    },
  },
})(HopModal);
