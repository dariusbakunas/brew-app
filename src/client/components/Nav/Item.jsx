import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Item(props) {
  const { as, label, url } = props;

  if (as === 'a') {
    return (
      <li><a href={url}>{label}</a></li>
    );
  } else {
    return (
      <li><Link to={url}>{label}</Link></li>
    );
  }
}

Item.defaultProps = {
  as: 'link',
};

Item.propTypes = {
  as: PropTypes.oneOf(['a', 'link']),
  label: PropTypes.string.isRequired,
  url: PropTypes.string,
};

export default Item;
