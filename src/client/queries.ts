import gql from 'graphql-tag';

export const GET_ROLES = gql`
  query GetRoles {
    roles {
      id
      name
      code
    }
  }
`;

export const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      name
      description
      type
      createdBy {
        username
      }
    }
  }
`;

export const GET_RECIPE = gql`
  query GetRecipe($id: ID!) {
    recipe(id: $id) {
      id
      batchSize
      boilTime
      description
      name
      type
      source
    }
  }
`;

export const GET_HOPS = gql`
  query GetHops($cursor: String, $limit: Int, $sortBy: SortableHopField, $sortDirection: SortDirection){
    hops(cursor: $cursor, limit: $limit, sortBy: $sortBy, sortDirection: $sortDirection) @connection(key: "hops") {
      data {
        id
        name
        aaHigh
        aaLow
        aroma
        betaHigh
        betaLow
        bittering
        description
        origin {
          id
          name
        }
      }
      pageInfo {
        nextCursor
      }
    }
  }
`;

export const GET_FERMENTABLES = gql`
  query GetFermentables($cursor: String, $limit: Int, $sortBy: SortableFermentableField, $sortDirection: SortDirection){
    fermentables(cursor: $cursor, limit: $limit, sortBy: $sortBy, sortDirection: $sortDirection) @connection(key: "fermentables") {
      data {
        id
        name
        category
        color
        description
        origin {
          id
          name
        }
        potential
        type
        yield
      }
      pageInfo {
        nextCursor
      }
    }
  }
`;

export const GET_YEAST = gql`
  query GetYeast($cursor: String, $limit: Int, $sortBy: SortableYeastField, $sortDirection: SortDirection) {
    yeast(cursor: $cursor, limit: $limit, sortBy: $sortBy, sortDirection: $sortDirection) @connection(key: "yeast") {
      data {
        id
        name
        form
        type
        description
        lab {
          id
          name
        }
        maxTemp
        minTemp
        minAttenuation
        maxAttenuation
        flocculation
      }
      pageInfo {
        nextCursor
      }
    }
  }
`;

export const GET_WATER = gql`
  query GetWater($cursor: String, $limit: Int, $sortBy: SortableWaterField, $sortDirection: SortDirection) {
    water(cursor: $cursor, limit: $limit, sortBy: $sortBy, sortDirection: $sortDirection) @connection(key: "water") {
      data {
        id
        name
        pH
        alkalinity
        calcium
        magnesium
        sodium
        sulfate
        chloride
        bicarbonate
        description
      }
      pageInfo {
        nextCursor
      }
    }
  }
`;

export const CREATE_HOP = gql`
  mutation CreateHop($input: HopInput!) {
    createHop(input: $input) {
      id
      name
      aaHigh
      aaLow
      betaHigh
      betaLow
      aroma
      bittering
      description
      origin {
        id
        name
      }
    }
  }
`;

export const CREATE_RECIPE = gql`
  mutation CreateRecipe($input: RecipeInput!) {
    createRecipe(input: $input) {
      id
      batchSize
      boilTime
      createdBy {
        id
        username
      }
      name
      description
      source
      type
    }
  }
`;

export const CREATE_ROLE = gql`
  mutation CreateRole($input: RoleInput!) {
    createRole(input: $input) {
      id
      name
      code
    }
  }
`;

export const CREATE_FERMENTABLE = gql`
  mutation CreateFermentable($input: FermentableInput!) {
    createFermentable(input: $input) {
      id
      name
      category
      color
      description
      origin {
        id
        name
      }
      potential
      type
      yield
    }
  }
`;

export const CREATE_YEAST = gql`
  mutation CreateYeast($input: YeastInput!) {
    createYeast(input: $input) {
      id
      name
      form
      type
      description
      lab {
        id
        name
      }
    }
  }
`;

export const CREATE_WATER = gql`
  mutation CreateWater($input: WaterInput!) {
    createWater(input: $input) {
      id
      name
      pH
      alkalinity
      calcium
      magnesium
      sodium
      sulfate
      chloride
      bicarbonate
      description
    }
  }
`;

export const UPDATE_HOP = gql`
  mutation UpdateHop($id: ID!, $input: HopInput!) {
    updateHop(id: $id, input: $input) {
      id
      name
      aaHigh
      aaLow
      betaHigh
      betaLow
      aroma
      bittering
      description
      origin {
        id
        name
      }
    }
  }
`;

export const UPDATE_FERMENTABLE = gql`
  mutation UpdateFermentable($id: ID!, $input: FermentableInput!) {
    updateFermentable(id: $id, input: $input) {
      id
      name
      category
      color
      description
      origin {
        id
        name
      }
      potential
      type
      yield
    }
  }
`;

export const UPDATE_YEAST = gql`
  mutation UpdateYeast($id: ID!, $input: YeastInput!) {
    updateYeast(id: $id, input: $input) {
      id
      name
      form
      type
      description
      lab {
        id
        name
      }
    }
  }
`;

export const UPDATE_WATER = gql`
  mutation UpdateWater($id: ID!, $input: WaterInput!) {
    updateWater(id: $id, input: $input) {
      id
      name
      pH
      alkalinity
      description
      calcium
      magnesium
      sodium
      sulfate
      chloride
      bicarbonate
    }
  }
`;

export const CREATE_INVITATION = gql`
  mutation CreateInvitation($email: String!, $sendEmail: Boolean) {
    createInvitation(email: $email, sendEmail: $sendEmail) {
      id
      email
      code
    }
  }
`;

export const GET_ALL_INVITATIONS = gql`
  query GetAllInvitations{
    invitations {
      id
      code
      email
    }
  }
`;

export const DELETE_INVITATION = gql`
  mutation DeleteInvitation($email: String!){
    deleteInvitation(email: $email)
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers{
    users {
      id
      username
      email
      status
      isAdmin
    }
  }
`;

export const REMOVE_USER = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id)
  }
`;

export const GET_ALL_COUNTRIES = gql`
  query GetAllCountries{
    countries {
      id
      name
    }
  }
`;

export const GET_YEAST_LABS = gql`
  query GetYeastLabs{
    yeastLabs {
      id
      name
    }
  }
`;

export const REMOVE_HOP = gql`
  mutation RemoveHop($id: ID!) {
    removeHop(id: $id)
  }
`;

export const REMOVE_YEAST = gql`
  mutation RemoveYeast($id: ID!) {
    removeYeast(id: $id)
  }
`;

export const REMOVE_FERMENTABLE = gql`
  mutation RemoveFermentable($id: ID!) {
    removeFermentable(id: $id)
  }
`;

export const REMOVE_WATER = gql`
  mutation RemoveWater($id: ID!) {
    removeWater(id: $id)
  }
`;
