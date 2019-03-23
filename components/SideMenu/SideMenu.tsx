import React, { Component, ReactNode } from 'react';
import Icon from '../Icon';
import Portal from '../Portal';

interface ISideMenuProps {
  id: string;
  children: ReactNode;
  mode?: 'slide' | 'push' | 'reveal' | 'none';
  onShow?: () => void;
  onHide?: () => void;
  overlay?: boolean;
  visible: boolean;
}

class SideMenu extends Component<ISideMenuProps> {
  public static defaultProps: Partial<ISideMenuProps> = {
    mode: 'none',
  };

  private ref: React.RefObject<HTMLDivElement>;

  constructor(props: ISideMenuProps) {
    super(props);
    this.ref = React.createRef();
  }

  public componentDidMount() {
    this.ref.current.addEventListener('show', this.handleShow);
    this.ref.current.addEventListener('hide', this.handleHide);

    if (!window.UIkit) {
      window.UIkit = require('uikit');
    }

    window.UIkit.offcanvas(this.ref.current, { mode: this.props.mode, overlay: this.props.overlay });
  }

  public componentWillUnmount() {
    this.ref.current.removeEventListener('hide', this.handleHide);
    this.ref.current.removeEventListener('show', this.handleShow);
  }

  public componentDidUpdate(prevProps: ISideMenuProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        window.UIkit.offcanvas(this.ref.current).show();
      } else {
        window.UIkit.offcanvas(this.ref.current).hide();
      }
    }
  }

  public render() {
    const {
      children, id
    } = this.props;

    return (
      <Portal selector='body'>
        <div id={id} ref={this.ref}>
          <div className='uk-offcanvas-bar'>
            <button className='uk-offcanvas-close uk-close uk-icon' type='button'>
              <Icon icon='close' width='14' height='14'/>
            </button>
            {children}
          </div>
        </div>
      </Portal>
    );
  }

  private handleShow = () => {
    if (this.props.onShow) {
      this.props.onShow();
    }
  }

  private handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }
  }
}

export default SideMenu;
