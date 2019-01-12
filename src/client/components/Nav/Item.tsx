import React from 'react';
import classNames from 'classnames';
import { RouteComponentProps } from 'react-router';
import { Link, matchPath, withRouter } from 'react-router-dom';

type ItemProps = RouteComponentProps<any> & {
  as?: 'a' | 'link',
  className?: string,
  label: string,
  location: {
    pathname: string,
  },
  onClick?: (e: React.MouseEvent<HTMLElement>) => void,
  url: string,
};

const Item: React.FunctionComponent<ItemProps> = (props: ItemProps) => {
  const {
    as, className, label, location, url,
  } = props;

  const isActive = !!matchPath(location.pathname, { path: url, exact: true });

  const classes = classNames(
    className,
    { 'uk-active': isActive },
  );

  if (as === 'a') {
    return (
      <li><a href={url} onClick={props.onClick}>{label}</a></li>
    );
  }
  return (
      <li className={classes}><Link to={url} onClick={props.onClick}>{label}</Link></li>
  );
};

Item.defaultProps = {
  as: 'link',
};

export default withRouter(Item);
