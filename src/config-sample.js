var _ = require('underscore'),

global = {

  // Allows us to name files based on absolute location
  root: __dirname,

  // The name of the app
  name: 'Import',

  // The DNS name of the server that the app is running on
  host: 'http://HOST_NAME',

  // The port the app should listen on
  port: 3000,

  // You must register an app on Github and provide the credentials
  github: {
    clientID: 'GITHUB_CLIENT', // change this
    clientSecret: 'GITHUB_SECRET', // change this
  }

},

// Settings specific to a development environment
development = {
  db: {
    db: 'import-dev',
    host: '127.0.0.1'
  },
  cookie: {
    secret: 'development',
    maxAge: 1000 * 60 * 60 * 12
  }
},

// Settings specific to a production environment
production = {
  db: {
    db: 'PROD_DB', // change this
    host: 'PROD_HOST' // change this
  },
  cookie: {
    secret: 'PROD_COOKIE_SECRET', // change this
    maxAge: 1000 * 60 * 60 * 12
  }
};

module.exports = {
  development: _.extend({}, global, development),
  production: _.extend({}, global, production)
};
