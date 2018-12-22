import { ServerError } from './errors';

const handleGraphQLError = (error) => {
  const { graphQLErrors, networkError } = error;

  if (networkError) {
    throw new ServerError(networkError);
  }

  let validationErrors = {};
  const errorMessages = [];

  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      const { extensions } = err;

      if (extensions.code === 'INTERNAL_SERVER_ERROR') {
        throw new ServerError(err.message);
      }

      errorMessages.push(err.message);

      if (extensions.code === 'BAD_USER_INPUT') {
        // merge validation errors for now
        validationErrors = {
          ...validationErrors,
          ...extensions.exception.validationErrors,
        };
      }
    });
  }

  return { validationErrors, errorMessages };
};

export default handleGraphQLError;
