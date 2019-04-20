import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const CREATE_ROLE = gql`
  mutation CreateRole($input: RoleInput!) {
    createRole(input: $input) {
      id
      name
      code
    }
  }
`;

const GET_ROLES = gql`
  query GetRoles {
    roles {
      id
      name
      code
    }
  }
`;

interface ICreateRoleResponse {
  createRole: string;
}

export const getRolesQuery = graphql(GET_ROLES, { name: 'getRoles' });

export const createRoleMutation = graphql<any, ICreateRoleResponse>(CREATE_ROLE, {
  name: 'createRole',
  options: {
    update: (cache, { data: { createRole: role } }) => {
      const { roles } = cache.readQuery({ query: GET_ROLES });
      cache.writeQuery({
        data: { invitations: [...roles, role] },
        query: GET_ROLES,
      });
    },
  },
});
