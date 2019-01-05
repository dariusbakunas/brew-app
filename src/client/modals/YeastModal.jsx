import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import Modal from './Modal';
import { Button, Form } from '../components';
import handleGrpahQLError from '../errors/handleGraphQLError';
import {
  GET_YEAST_LABS, CREATE_YEAST, UPDATE_YEAST,
} from '../queries';

class YeastModal extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    createYeast: PropTypes.func.isRequired,
    getYeastLabs: PropTypes.shape({
      loading: PropTypes.bool,
      yeastLabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      })),
    }),
    yeast: PropTypes.shape({
      name: PropTypes.string,
      lab: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    }),
    onHide: PropTypes.func,
    open: PropTypes.bool,
    refetchQuery: PropTypes.object,
    updateYeast: PropTypes.func.isRequired,
  };

  static getDefaultState = labId => ({
    name: null,
    form: 'DRY',
    type: 'ALE',
    labId,
    description: null,
    error: null,
    loading: false,
    validationErrors: null,
  });

  constructor(props) {
    super(props);
    if (props.yeast) {
      this.state = {
        ...props.yeast,
        labId: props.yeast.lab.id,
        loading: false,
        error: null,
        validationErrors: null,
      };
    } else {
      const labId = props.getYeastLabs.yeastLabs ? props.getYeastLabs.yeastLabs[0].id : null;
      this.state = YeastModal.getDefaultState(labId);
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.yeast && this.props.yeast) {
      this.setState({
        ...this.props.yeast,
        labId: this.props.yeast.lab.id,
        loading: false,
        error: null,
        validationErrors: null,
      });
    }

    if (!prevProps.getYeastLabs.yeastLabs && this.props.getYeastLabs.yeastLabs) {
      this.setState({
        labId: this.props.getYeastLabs.yeastLabs[0].id,
      });
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }

    this.setState(YeastModal.getDefaultState());
  };

  handleSubmit = (e, closeModal) => {
    e.preventDefault();

    const { createYeast, updateYeast, yeast } = this.props;

    this.setState({ loading: true }, () => {
      const {
        name, form, type, labId, description,
      } = this.state;

      const variables = {
        input: {
          name,
          form,
          type,
          labId,
          description,
        },
      };

      let fn = createYeast;

      if (yeast) {
        variables.id = yeast.id;
        fn = updateYeast;
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
      yeast, id, open, getYeastLabs,
    } = this.props;

    const {
      error, validationErrors, name, type, form, loading, description, labId
    } = this.state;

    const types = [
      { value: 'ALE', label: 'Ale' },
      { value: 'CHAMPAGNE', label: 'Champagne' },
      { value: 'LAGER', label: 'Lager' },
      { value: 'WHEAT', label: 'Wheat' },
      { value: 'WINE', label: 'Wine' },
    ];

    return (
      <Modal
        error={error}
        header={yeast ? yeast.name : 'New Yeast'}
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
                <Form.Radio
                  label='Dry'
                  name='form'
                  value='DRY'
                  onChange={this.handleChange}
                  checked={form === 'DRY'}
                />
                <Form.Radio
                  name='form'
                  value='LIQUID'
                  onChange={this.handleChange}
                  label='Liquid'
                  checked={form === 'LIQUID'}
                />
              </div>
              <div className="uk-margin">
                <Form.Select
                  label='Type'
                  error={validationErrors ? validationErrors.type : null}
                  name='type'
                  value={type}
                  onChange={this.handleChange}
                  options={types}
                />
              </div>
              <div className="uk-margin">
                <Form.Select
                  label='Lab'
                  name='labId'
                  onChange={this.handleChange}
                  options={
                    getYeastLabs.yeastLabs ? getYeastLabs.yeastLabs.map(
                      lab => ({ value: lab.id, label: lab.name }),
                    ) : []}
                  value={labId}
                  />
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
  graphql(GET_YEAST_LABS, { name: 'getYeastLabs' }),
  graphql(CREATE_YEAST, {
    name: 'createYeast',
    options: props => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
  graphql(UPDATE_YEAST, {
    name: 'updateYeast',
    options: props => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
)(YeastModal);
