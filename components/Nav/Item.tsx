import classNames from 'classnames';
import Link from 'next/link';
import { withRouter } from 'next/router';
import React from 'react';
import { RouteComponentProps } from 'react-router';

type ItemProps = RouteComponentProps<any> & {
  as?: 'a' | 'link',
  className?: string,
  label: string,
  router: {
    asPath: string,
  },
  url: string,
};

const Item: React.FunctionComponent<ItemProps> = (props: ItemProps) => {
  const {
    as, className, label, router, url,
  } = props;

  const isActive = router.asPath === url;

  const classes = classNames(
    className,
    { 'uk-active': isActive },
  );

  if (as === 'a') {
    return (
      <li><a href={url}>{label}</a></li>
    );
  }
  return (
    <li className={classes}><Link href={url}><a>{label}</a></Link></li>
  );
};

Item.defaultProps = {
  as: 'link',
};

export default withRouter(Item);
