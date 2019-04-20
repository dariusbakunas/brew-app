import React from 'react';
import { compose } from 'react-apollo';
import { UserRole } from '../../types';
import {
  Container, Spinner, Table,
} from '../components';
import { getRolesQuery } from '../HOC/roles';

interface IRolesPageProps {
  getRoles: {
    loading: boolean,
    roles: Array<UserRole & { id: string }>,
  };
}

class RolesPage extends React.Component<IRolesPageProps> {
  public render() {
    const { loading, roles = [] } = this.props.getRoles;

    return (
      <Container>
        {
          roles.length ?
            <Table size='small' stripped={true}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Code</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  roles.map((role) => (
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

export default compose(
  getRolesQuery,
)(RolesPage);
