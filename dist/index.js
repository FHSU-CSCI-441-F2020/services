"use strict";

var _express = _interopRequireDefault(require("express"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _apolloServerExpress = require("apollo-server-express");

var _schema = _interopRequireDefault(require("./schema"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _models = _interopRequireWildcard(require("./models"));

var _cors = _interopRequireDefault(require("cors"));

var _http = _interopRequireDefault(require("http"));

var _dataloader = _interopRequireDefault(require("dataloader"));

var _loaders = _interopRequireDefault(require("./loaders"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Token generation
// Import required modules for Apollo/GraphQL
// Allow for cross-domain request
// Allow transfer of data over HTTP
// import { createDeflateRaw } from "zlib";
// set app variable to express main function
const app = (0, _express.default)(); // Allow cross domain request

app.use((0, _cors.default)()); // Set current user

const getMe = async req => {
  // token from header
  const token = req.headers["x-token"]; // If token is found

  if (token) {
    // Verify token matches secret token
    try {
      return await _jsonwebtoken.default.verify(token, process.env.SECRET);
    } catch (e) {
      throw new _apolloServerExpress.AuthenticationError("Your session expired. Sign in again.");
    }
  }
}; // Init apollo server with schema and resolvers


const server = new _apolloServerExpress.ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: _schema.default,
  resolvers: _resolvers.default,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message.replace("SequelizeValidationError: ", "").replace("Validation error: ", "");
    return { ...error,
      message
    };
  },
  context: async ({
    req,
    connection
  }) => {
    if (connection) {
      return {
        models: _models.default,
        loaders: {
          user: new _dataloader.default(keys => _loaders.default.user.batchUsers(keys, _models.default))
        }
      };
    }

    if (req) {
      const me = await getMe(req);
      return {
        models: _models.default,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new _dataloader.default(keys => _loaders.default.user.batchUsers(keys, _models.default))
        }
      };
    }
  }
}); // Set API path and include express as middleware

server.applyMiddleware({
  app,
  path: "/graphql"
}); // Init http server to handle subscriptions

const httpServer = _http.default.createServer(app);

server.installSubscriptionHandlers(httpServer); // Check if using testing database

const isDevelopment = !!process.env.DATABASE_DEVELOP; // Check if production database in use

const isProduction = !!process.env.DATABASE_URL; // Port based on prod or dev environment

const port = process.env.PORT || 8000; // Connect to postgres database through sequelize

_models.sequelize.sync({
  force: true,
  logging: true
}).then(async () => {
  // sequelize.sync({ force: isTest }).then(async () => {
  if (isDevelopment) {
    createDefaultData();
  } // Listen on port based on prod or dev


  httpServer.listen({
    port
  }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
}); // For development, clean database, complete necessary table/column updates, add
// data for each model


async function createDefaultData() {
  await _models.default.User.create({
    username: "Admin",
    email: "admin@jobkik.com",
    password: "admin",
    firstName: "Head",
    lastName: "Admin",
    role: "admin",
    phoneNumber: "5555555555",
    completedProfile: false
  });
  await _models.default.User.create({
    username: "User",
    email: "user@jobkik.com",
    password: "password",
    firstName: "Main",
    lastName: "User",
    role: "user",
    phoneNumber: "1111111111",
    completedProfile: true
  });
  await _models.default.UserProfile.create({
    userId: "2",
    statement: "This is a statement",
    education: ["No education"],
    workExperience: ["No experience"],
    lookingFor: ["Not looking for anything"],
    skills: ["No skills"],
    active: true,
    address1: "123 Main",
    city: "Kansas City",
    state: "MO",
    zip: 64151,
    country: "US"
  });
}
//# sourceMappingURL=index.js.map