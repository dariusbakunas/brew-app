import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Header, LoadingBar } from '../components';

interface IModalProps {
  id: string;
  error?: string;
  header: string;
  loading: boolean;
  onHide: () => void;
  open?: boolean;
  render: (callback: () => void) => ReactNode;
}

class Modal extends React.Component<IModalProps> {
  private ref: React.RefObject<HTMLDivElement>;

  constructor(props: IModalProps) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      open: false,
    };
  }

  public componentDidMount() {
    this.ref.current.addEventListener('hidden', this.handleHide);
  }

  public componentWillUnmount() {
    this.ref.current.removeEventListener('hidden', this.handleHide);
  }

  public componentDidUpdate(prevProps: IModalProps) {
    if (prevProps.open && !this.props.open) {
      this.hide();
    } else if (!prevProps.open && this.props.open) {
      this.show();
    }
  }

  public render() {
    const {
      id, error, header, loading,
    } = this.props;

    if (typeof document !== 'undefined') {
      return ReactDOM.createPortal(
        <div id={id} ref={this.ref} data-uk-modal={true}>
          <div className='uk-modal-dialog uk-modal-body'>
            <button className='uk-modal-close-default' type='button' data-uk-close={true}/>
            <Header as='h2' className='uk-modal-title'>{header}</Header>
            <LoadingBar active={loading}/>
            {
              error &&
              <span className='uk-text-danger'>{error}</span>
            }
            {this.props.render(this.hide)}
          </div>
        </div>,
        document.body,
      );
    }

    // no need to render modals server-side
    return null;
  }

  private handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  private hide = () => {
    window.UIkit.modal(this.ref.current).hide();
  }

  private show = () => {
    window.UIkit.modal(this.ref.current).show();
  }
}

export default Modal;
