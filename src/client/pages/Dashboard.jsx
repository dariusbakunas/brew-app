import React from 'react';
import PropTypes from 'prop-types';
import withServerContext from '../HOC/withServerContext';
import { USER_STATUS } from '../../contants';

class Dashboard extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      status: PropTypes.oneOf(Object.values(USER_STATUS)),
    }),
  };

  render() {
    return (
      <div>Dashboard</div>
    );
  }
}

export default withServerContext(Dashboard);
