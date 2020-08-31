"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAuthEmployee = exports.isUser = exports.isMessageOwner = exports.isAdmin = exports.isAuthenticated = void 0;

var _apolloServer = require("apollo-server");

var _graphqlResolvers = require("graphql-resolvers");

// Apollo error handling
// Allow for authorizations and null returns
// Verify user is authenticated
const isAuthenticated = (parent, args, {
  me
}) => me ? _graphqlResolvers.skip : new _apolloServer.ForbiddenError("Not authenticated as user."); // Verify is user is admin


exports.isAuthenticated = isAuthenticated;
const isAdmin = (0, _graphqlResolvers.combineResolvers)(isAuthenticated, (parent, args, {
  me: {
    role
  }
}) => role === "ADMIN" ? _graphqlResolvers.skip : new _apolloServer.ForbiddenError("Not authorized as admin.")); // Check if message is owned by user

exports.isAdmin = isAdmin;

const isMessageOwner = async (parent, {
  id
}, {
  models,
  me
}) => {
  const message = await models.Message.findByPk(id, {
    raw: true
  });

  if (message.userId !== me.id) {
    throw new _apolloServer.ForbiddenError("Not authenticated as owner.");
  }

  return _graphqlResolvers.skip;
}; // Check if user is current user


exports.isMessageOwner = isMessageOwner;

const isUser = async (parent, {
  id
}, {
  models,
  me
}) => {
  const user = await models.User.findByPk(id, {
    raw: true
  });

  if (user.id !== me.id) {
    throw new _apolloServer.ForbiddenError("Not authenticated as user.");
  }

  return _graphqlResolvers.skip;
}; // Check if user is current owner or team member


exports.isUser = isUser;

const isAuthEmployee = async (parent, {
  id
}, {
  models,
  me
}) => {
  const employer = await models.Employer.findByPk(id, {
    raw: true
  });

  if (employer.owner !== me.id) {
    throw new _apolloServer.ForbiddenError("Not authenticated as user.");
  } // && !_.includes(employer.teamMembers, me.id)


  return _graphqlResolvers.skip;
};

exports.isAuthEmployee = isAuthEmployee;
//# sourceMappingURL=authorization.js.map