import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import Header from './Header';
import Divider from './Divider';

type NavProps = {
  children: ReactNode
};

class Nav extends React.Component<NavProps> {
  static propTypes = {
    children: PropTypes.node,
  };

  static Header = Header;

  static Item = Item;

  static Divider = Divider;

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
