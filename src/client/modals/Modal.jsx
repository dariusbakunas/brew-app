import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LoadingBar from '../components/LoadingBar';
import Header from '../components/Header';

class Modal extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    error: PropTypes.string,
    header: PropTypes.string,
    loading: PropTypes.bool,
    onHide: PropTypes.func,
    render: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      open: false,
    };
  }

  handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }
  };

  componentDidMount() {
    this.ref.current.addEventListener('hidden', this.handleHide);
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener('hidden', this.handleHide);
  }

  close = () => {
    window.UIkit.modal(this.ref.current).hide();
  };

  render() {
    const {
      id, error, header, loading,
    } = this.props;

    if (typeof document !== 'undefined') {
      return ReactDOM.createPortal(
        <div id={id} ref={this.ref} data-uk-modal>
          <div className='uk-modal-dialog uk-modal-body'>
            <button className='uk-modal-close-default' type='button' data-uk-close/>
            <Header as='h2' className='uk-modal-title'>{header}</Header>
            <LoadingBar active={loading}/>
            {
              error &&
              <span className='uk-text-danger'>{this.state.error}</span>
            }
            {this.props.render(this.close)}
          </div>
        </div>,
        document.body,
      );
    }

    // no need to render modals server-side
    return null;
  }
}

export default Modal;
