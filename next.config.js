const withPlugins = require('next-compose-plugins');
const withTypescript = require('@zeit/next-typescript');
const withSass = require('@zeit/next-sass');

const PORT = process.env.APP_PORT || 3000;

module.exports = withPlugins(
  [withTypescript, withSass],
  {
    port: PORT,

    // turn off file based routing
    // https://github.com/zeit/next.js#disabling-file-system-routing
    useFileSystemPublicRoutes: false,
    serverRuntimeConfig: {
      apollo: {
        link: {
          uri: `http://localhost:${PORT}/api`,
        }
      },
    },
    publicRuntimeConfig: {
      apollo: {
        link: {
          uri: '/api',
        }
      },
    },
  }
)
