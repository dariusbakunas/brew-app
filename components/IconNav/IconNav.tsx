import React, { Component, ReactNode } from 'react';
import classNames from 'classnames';
import Item from './Item';

type IconNavProps = {
  children: ReactNode,
  className?: string,
};

class IconNav extends Component<IconNavProps> {
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
