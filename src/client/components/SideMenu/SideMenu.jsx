import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  handleShow = () => {
    if (this.props.onShow) {
      this.props.onShow();
    }
  };

  handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }
  };

  componentDidMount() {
    this.ref.current.addEventListener('show', this.handleShow);
    this.ref.current.addEventListener('hide', this.handleHide);
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener(this.handleHide);
    this.ref.current.removeEventListener(this.handleShow);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        window.UIkit.offcanvas(this.ref.current).show();
      } else {
        window.UIkit.offcanvas(this.ref.current).hide();
      }
    }
  }

  render() {
    const {
      children, id, mode, overlay,
    } = this.props;

    return (
      <div id={id} data-uk-offcanvas={`mode: ${mode}; overlay: ${overlay}`} ref={this.ref}>
        <div className='uk-offcanvas-bar'>
          <button className='uk-offcanvas-close uk-close uk-icon' type='button'>
            <Icon icon='close' width='14' height='14'/>
          </button>
          {children}
        </div>
      </div>
    );
  }
}

SideMenu.defaultProps = {
  mode: 'none',
};

SideMenu.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  mode: PropTypes.oneOf(['slide', 'push', 'reveal', 'none']),
  onShow: PropTypes.func,
  onHide: PropTypes.func,
  overlay: PropTypes.bool,
  visible: PropTypes.bool,
};

export default SideMenu;
