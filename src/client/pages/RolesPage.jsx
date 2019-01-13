import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Mutation } from 'react-apollo';
import {
  Container, Table, Spinner, IconNav,
} from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';
import withServerContext from '../HOC/withServerContext';
import { GET_ROLES } from '../queries';

class RolesPage extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      roles: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        code: PropTypes.string,
      })),
    }),
  };

  render() {
    const { loading, roles = [] } = this.props.data;

    return (
      <Container>
        {
          roles.length ?
            <Table size='small' stripped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Code</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  roles.map(role => (
                    <Table.Row key={role.id}>
                      <Table.Cell>{role.name}</Table.Cell>
                      <Table.Cell>{role.code}</Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table> :
            <div className='uk-margin-bottom'>No roles</div>
        }
        <Spinner active={loading}/>
      </Container>
    );
  }
}

export default graphql(GET_ROLES)(RolesPage);
