import React from 'react';
import { compose, graphql } from 'react-apollo';
import Modal from './Modal';
import { Button, Form } from '../components';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { CREATE_YEAST, GET_YEAST_LABS, UPDATE_YEAST } from '../queries';
import {
  Yeast, YeastForm, YeastInput, YeastLab, YeastType,
} from '../../types';
import { InputChangeHandlerType } from '../components/Form/Input';

type YeastModalProps = {
  id: string,
  createYeast: (args: { variables: YeastInput }) => Promise<void>,
  getYeastLabs: {
    loading: boolean,
    yeastLabs: YeastLab[],
  },
  yeast: Yeast & { id: string },
  onHide: () => void,
  open: boolean,
  refetchQuery: any,
  updateYeast: (args: { variables: YeastInput }) => Promise<void>,
};

type YeastModalState = Yeast & {
  error?: string,
  labId: string,
  loading: boolean,
  validationErrors: {
    [key: string]: string,
  }
};

class YeastModal extends React.Component<YeastModalProps> {
  readonly state: Readonly<YeastModalState>;

  static getDefaultState: (labId?: string) => YeastModalState = labId => ({
    name: null,
    form: YeastForm.DRY,
    type: YeastType.ALE,
    labId,
    description: null,
    error: null,
    loading: false,
    validationErrors: null,
  });

  constructor(props: YeastModalProps) {
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

  componentDidUpdate(prevProps: YeastModalProps) {
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

  handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }

    this.setState(YeastModal.getDefaultState());
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>, closeModal: () => void) => {
    e.preventDefault();

    const { createYeast, updateYeast, yeast } = this.props;

    this.setState({ loading: true }, () => {
      const {
        name, form, type, labId, description,
      } = this.state;

      const variables: YeastInput = {
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
      error, validationErrors, name, type, form, loading, description, labId,
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
    options: (props: YeastModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
  graphql(UPDATE_YEAST, {
    name: 'updateYeast',
    options: (props: YeastModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
)(YeastModal);
