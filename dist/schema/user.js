"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

// User schemas
var _default = (0, _apolloServerExpress.gql)`
  extend type Query {
    getUser(id: ID!): User
    getUsers: [User!]
    me: User
  }

  extend type Mutation {
    registerUser(
      username: String
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      phoneNumber: String
      role: String!
    ): NewUser!

    loginUser(login: String!, password: String!): NewUser

    updateUser(
      id: ID!
      username: String
      email: String
      password: String
      firstName: String
      lastName: String
      phoneNumber: String
      role: String
    ): User!

    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    phoneNumber: String
    role: String!
    messages: [Message!]
    completedProfile: Boolean
  }

  type NewUser {
    user: User
    token: String!
  }
`;

exports.default = _default;
//# sourceMappingURL=user.js.map