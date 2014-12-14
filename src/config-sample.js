var _ = require('underscore'),

global = {

  root: __dirname,

  app: {
    name: 'Import'
  },

  // comment out this line if you want to use different ports 
  // for developement & production environments
  port: 3000,

  github: {
    clientID: 'GITHUB_CLIENT_ID',
    clientSecret: 'GITHUB_CLIENT_SECRET',
  }

};

development = {
  db: {
    db: 'DEV_DB',
    host: '127.0.0.1'
  },
  cookie: {
    secret: 'development',
    maxAge: 1000 * 60 * 60 * 12
  },
  allowRepl : false
};

production = {
  db: {
    db: 'PROD_DB',
    host: '127.0.0.1'
  },
  cookie: {
    secret: 'COOKIE_SECRET', // change this, obviously
    maxAge: 1000 * 60 * 60 * 12
  },
  allowRepl : false
};

repl = {
  db: {
    db: 'DEV_DB',
    host: '127.0.0.1'
  },
  cookie: {
    secret: 'repl',
    maxAge: 1000 * 60 * 60 * 12
  },
  allowRepl : true
};


module.exports = {
  repl: _.extend({}, global, repl),
  development: _.extend({}, global, development),
  production: _.extend({}, global, production)
};