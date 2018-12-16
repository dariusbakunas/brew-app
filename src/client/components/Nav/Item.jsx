import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link, matchPath, withRouter } from 'react-router-dom';

function Item(props) {
  const {
    as, className, label, location, url,
  } = props;

  const isActive = !!matchPath(location.pathname, { path: url });

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
}

Item.defaultProps = {
  as: 'link',
};

Item.propTypes = {
  as: PropTypes.oneOf(['a', 'link']),
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  onClick: PropTypes.func,
  url: PropTypes.string,
};

export default withRouter(Item);
