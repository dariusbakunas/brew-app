import { ApolloError } from 'apollo-client';
import { ServerError } from './errors';

const handleGraphQLError = (error: ApolloError, useBoundary = true) => {
  const { graphQLErrors, networkError } = error;

  let validationErrors = {};
  let errorMessage = null;

  if (networkError) {
    if (useBoundary) {
      throw new ServerError(networkError.message);
    } else {
      errorMessage = 'Unknown error occurred, please try again';
    }
  } else if (graphQLErrors) {
    const internalError = graphQLErrors.find(err => err.extensions.code === 'INTERNAL_SERVER_ERROR');

    if (internalError) {
      if (useBoundary) {
        throw new ServerError(internalError.message);
      } else {
        errorMessage = 'Unknown error occurred, please try again';
      }
    } else {
      graphQLErrors.forEach((err) => {
        const { extensions } = err;

        if (extensions.code === 'BAD_USER_INPUT') {
          errorMessage = 'Please check your input';

          // merge validation errors for now
          validationErrors = {
            ...validationErrors,
            ...extensions.exception.validationErrors,
          };
        }
      });
    }
  }

  return { validationErrors, errorMessage };
};

export default handleGraphQLError;
