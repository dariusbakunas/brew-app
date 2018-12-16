import React from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import Header from './Header';

class Nav extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static Header = Header;
  static Item = Item;

  render() {
    const { children } = this.props;

    return (
      <ul className='uk-nav uk-nav-default'>
        {children}
      </ul>
    );
  }
}

export default Nav;
