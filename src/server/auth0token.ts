import request from 'request';

interface Token {
  accessToken: string,
  tokenType: string,
  expiresAt: number,
}

const options = {
  method: 'POST',
  url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
  headers: { 'content-type': 'application/json' },
  body:
    {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_API_ID,
    },
  json: true,
};

let token: Token = null;

const getAuth0Token = (): Promise<Token> => new Promise((resolve, reject) => {
  // subtract 5 minutes for safety
  if (token && new Date().getTime() < token.expiresAt - 5 * 1000 * 60) {
    return resolve(token);
  }

  console.log('Getting new Auth0 API token');

  return request(options, (error, response, body) => {
    if (error) return reject(new Error(error));

    const { access_token: accessToken, expires_in: expiresIn, token_type: tokenType } = body;

    const expiresAt = (expiresIn * 1000) + new Date().getTime();

    token = {
      accessToken,
      tokenType,
      expiresAt,
    };

    return resolve(token);
  });
});

export default getAuth0Token;
