
const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

// mongDbStore wants the session for which it will be created, so I will accept a session as a parameter value here, and we'll have to make sure to provide that valueonce we call createSessionStore, and forward that to mongoDbStore.


function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);
// we can call new mongoDbStore to create a new store objectbased on that constructor function,that is provided by third packet package


  const store = new MongoDBStore({
    uri: 'mongodb://0.0.0.0:27017',
    databaseName: 'online-shop',
    collection: 'sessions'                   //in which our session stored
  });

  return store;  //This will then give us the final store which we can use and attached to our session, and that is the store I will return here
}

 //Now I'll add another function in here, and that is the createSessionConfig function, in which I wanna create a configuration for my session.
 // session function, which I'm executing here wants a JavaScript object in which we can set various properties to configure this session.

function createSessionConfig() {
  return {
    secret: 'super-secret',             //used for securing this session.
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),          //The store setting controls where the session data actually should be stored.
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000
    }
  };
}

module.exports = createSessionConfig;