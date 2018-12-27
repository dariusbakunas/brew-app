import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Item from './Item';


class IconNav extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  static Item = Item;

  render() {
    const { children, className } = this.props;

    const classes = classNames(
      'uk-iconnav',
      className,
    );

    return (
      <ul className={classes}>
        {children}
      </ul>
    );
  }
}

export default IconNav;
