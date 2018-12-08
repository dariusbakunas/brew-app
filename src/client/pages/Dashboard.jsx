import React from 'react';
import PropTypes from 'prop-types';
import withServerContext from '../HOC/withServerContext';

class Dashboard extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      status: PropTypes.oneOf(['NEW', 'ACTIVE']),
    }),
  };

  render() {
    return (
      <div>Dashboard</div>
    );
  }
}

export default withServerContext(Dashboard);
