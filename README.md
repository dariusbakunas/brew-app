# Brew-APP

| master        | dev           |
| ------------- | ------------- |
| [![Build Status](https://travis-ci.org/dariusbakunas/brew-app.svg?branch=master)](https://travis-ci.org/dariusbakunas/brew-app) | [![Build Status](https://travis-ci.org/dariusbakunas/brew-app.svg?branch=dev)](https://travis-ci.org/dariusbakunas/brew-app)  |
| [![Coverage Status](https://coveralls.io/repos/github/dariusbakunas/brew-app/badge.svg?branch=master)](https://coveralls.io/github/dariusbakunas/brew-app?branch=master) | [![Coverage Status](https://coveralls.io/repos/github/dariusbakunas/brew-app/badge.svg?branch=dev)](https://coveralls.io/github/dariusbakunas/brew-app?branch=dev)             |

# Configure for local dev

* Create .env with these settings:

      SESSION_SECRET=
      AUTH0_DOMAIN=
      AUTH0_CLIENT_ID=
      AUTH0_CLIENT_SECRET=
      AUTH0_API_ID=
      JWT_SECRET=
      BREW_API_HOST=http://localhost:4000/graphql
      AUTH0_CALLBACK_URL=http://localhost:3000/callback
      MEMCACHED_HOST=

# Build

    % npm run build:dev
    
# Launch

    % npm run server:dev
    
# IntelliJ

  Runtime config:
  
    * Select node 10.x
    * Params: `-r dotenv/config -r ts-node/register`
    * Env: `TS_NODE_PROJECT=tsconfig.server.json`
    
# References

  * next.js + apollo setup: [https://github.com/necccc/nextjs-apollo-graphql](https://github.com/necccc/nextjs-apollo-graphql)
