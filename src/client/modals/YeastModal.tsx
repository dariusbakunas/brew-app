import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { IYeast, YeastFlocculation, YeastForm, YeastInput, YeastLab, YeastType } from '../../types';
import { Button, Form } from '../components';
import { InputChangeHandlerType } from '../components/Form/Input';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { CREATE_YEAST, GET_YEAST_LABS, UPDATE_YEAST } from '../queries';
import Modal from './Modal';

interface IYeastModalProps {
  id: string;
  createYeast: (args: { variables: YeastInput }) => Promise<void>;
  getYeastLabs: {
    loading: boolean,
    yeastLabs: YeastLab[],
  };
  yeast: IYeast & { id: string };
  onHide: () => void;
  open: boolean;
  refetchQuery: any;
  updateYeast: (args: { variables: YeastInput }) => Promise<void>;
}

interface IYeastModalState {
  error?: string;
  labId?: string;
  loading?: boolean;
  validationErrors?: {
    [key: string]: string,
  };
}

export class YeastModal extends React.Component<IYeastModalProps, IYeastModalState & Partial<IYeast>> {
  private static getDefaultState: (labId?: string) => IYeastModalState & IYeast = (labId) => ({
    description: null,
    error: null,
    flocculation: YeastFlocculation.MEDIUM,
    form: YeastForm.DRY,
    labId,
    loading: false,
    name: null,
    type: YeastType.ALE,
    validationErrors: null,
  })

  constructor(props: IYeastModalProps) {
    super(props);
    if (props.yeast) {
      this.state = {
        ...props.yeast,
        error: null,
        labId: props.yeast.lab.id,
        loading: false,
        validationErrors: null,
      };
    } else {
      const labId = props.getYeastLabs.yeastLabs ? props.getYeastLabs.yeastLabs[0].id : null;
      this.state = YeastModal.getDefaultState(labId);
    }
  }

  public componentDidUpdate(prevProps: IYeastModalProps) {
    if (!prevProps.yeast && this.props.yeast) {
      this.setState({
        ...this.props.yeast,
        error: null,
        labId: this.props.yeast.lab.id,
        loading: false,
        validationErrors: null,
      });
    }

    if (!prevProps.getYeastLabs.yeastLabs && this.props.getYeastLabs.yeastLabs) {
      this.setState({
        labId: this.props.getYeastLabs.yeastLabs[0].id,
      });
    }
  }

  public render() {
    const {
      yeast, id, open, getYeastLabs,
    } = this.props;

    const {
      error, validationErrors, name, type, form, loading, description, labId, flocculation,
    } = this.state;

    const types = [
      { value: 'ALE', label: 'Ale' },
      { value: 'CHAMPAGNE', label: 'Champagne' },
      { value: 'LAGER', label: 'Lager' },
      { value: 'WHEAT', label: 'Wheat' },
      { value: 'WINE', label: 'Wine' },
    ];

    // const floculation = [
    //   { value: YeastFlocculation.LOW, label: 'Low' },
    //   { value: YeastFlocculation.MEDIUM, label: 'Medium' },
    //   { value: YeastFlocculation.HIGH, label: 'High' },
    // ];

    return (
      <Modal
        error={error}
        header={yeast ? yeast.name : 'New Yeast'}
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
              <div className='uk-margin'>
                <Form.Select
                  label='Type'
                  error={validationErrors ? validationErrors.type : null}
                  name='type'
                  value={type}
                  onChange={this.handleChange}
                  options={types}
                />
              </div>
              <div className='uk-margin'>
                <Form.Select
                  label='Lab'
                  name='labId'
                  onChange={this.handleChange}
                  options={
                    getYeastLabs.yeastLabs ? getYeastLabs.yeastLabs.map(
                      (lab) => ({ value: lab.id, label: lab.name }),
                    ) : []}
                  value={labId}
                />
              </div>
              <div className='uk-margin'>
                <div className='uk-form-label'>Flocculation</div>
                <div className='uk-form-controls'>
                  <Form.Radio
                    label='Low'
                    name='flocculation'
                    value='LOW'
                    onChange={this.handleChange}
                    checked={flocculation === 'LOW'}
                  />
                  <Form.Radio
                    label='Medium'
                    name='flocculation'
                    value='MEDIUM'
                    onChange={this.handleChange}
                    checked={flocculation === 'MEDIUM'}
                  />
                  <Form.Radio
                    label='High'
                    name='flocculation'
                    value='HIGH'
                    onChange={this.handleChange}
                    checked={flocculation === 'HIGH'}
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

  private handleChange: InputChangeHandlerType =
    (e, { name, value }) => {
      return this.setState({[name]: value});
    }

  private handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }

    this.setState(YeastModal.getDefaultState());
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>, closeModal: () => void) => {
    e.preventDefault();

    const { createYeast, updateYeast, yeast } = this.props;

    this.setState({ loading: true }, () => {
      const {
        name, form, type, labId, description, flocculation,
      } = this.state;

      const variables: YeastInput = {
        input: {
          description,
          flocculation,
          form,
          labId,
          name,
          type,
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
  }
}

export default compose(
  graphql(GET_YEAST_LABS, { name: 'getYeastLabs' }),
  graphql(CREATE_YEAST, {
    name: 'createYeast',
    options: (props: IYeastModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
  graphql(UPDATE_YEAST, {
    name: 'updateYeast',
    options: (props: IYeastModalProps) => ({
      awaitRefetchQueries: true,
      refetchQueries: [props.refetchQuery],
    }),
  }),
)(YeastModal);
