import React, { Component, ReactNode } from 'react';
import Icon from '../Icon';

type SideMenuProps = {
  id: string,
  children: ReactNode,
  mode?: 'slide' | 'push' | 'reveal' | 'none',
  onShow?: () => void,
  onHide?: () => void,
  overlay?: boolean,
  visible: boolean,
};

class SideMenu extends Component<SideMenuProps> {
  private ref: React.RefObject<HTMLDivElement>;

  static defaultProps: Partial<SideMenuProps> = {
    mode: 'none',
  };

  constructor(props: SideMenuProps) {
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
    this.ref.current.removeEventListener('hide', this.handleHide);
    this.ref.current.removeEventListener('show', this.handleShow);
  }

  componentDidUpdate(prevProps: SideMenuProps) {
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

export default SideMenu;
