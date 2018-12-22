import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Item from './Item';


class IconNav extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static Item = Item;

  render() {
    const { children } = this.props;

    const classes = classNames(
      'uk-iconnav',
    );

    return (
      <ul className={classes}>
        {children}
      </ul>
    );
  }
}

export default IconNav;
