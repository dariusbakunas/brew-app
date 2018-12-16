import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

function SideMenu(props) {
  const {
    children, id, mode, overlay,
  } = props;

  return (
    <div id={id} data-uk-offcanvas={`mode: ${mode}; overlay: ${overlay}`}>
      <div className='uk-offcanvas-bar'>
        <button className='uk-offcanvas-close uk-close uk-icon' type='button'>
          <Icon icon='close' width='14' height='14'/>
        </button>
        {children}
      </div>
    </div>
  );
}

SideMenu.defaultProps = {
  mode: 'none',
};

SideMenu.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  mode: PropTypes.oneOf(['slide', 'push', 'reveal', 'none']),
  overlay: PropTypes.bool,
};

export default SideMenu;
