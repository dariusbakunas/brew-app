import { ApolloError } from 'apollo-client';

const formatClientError = (error: ApolloError) => {
  const displayError = {
    message: 'Unknown error occurred, please try again',
  };

  if (error.constructor.name === 'AuthorizationError') {
    displayError.message = 'Your are not authorized to access this resource';
  } else if (error.constructor.name === 'GenericError') {
    displayError.message = error.message;
  }

  return displayError;
};

export default formatClientError;
