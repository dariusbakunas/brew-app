import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Transition } from 'semantic-ui-react';
import withServerContext from '../HOC/withServerContext';
import Login from './Login';

const GET_LOGIN_QUOTE = gql`
  {
    randomQuote {
      text
      author
    }
  }
`;

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
    if (!this.props.user) {
      return (
        <Query query={GET_LOGIN_QUOTE}>
          {
            ({ loading, data, error }) => {
              if (error) { return 'Error'; }

              return (
                <Transition visible={!loading} animation='scale' duration={500}>
                  <Login quote={data.randomQuote}/>
                </Transition>
              );
            }
          }
        </Query>
      );
    }

    return (
      <div>Dashboard</div>
    );
  }
}

export default withServerContext(Dashboard);
