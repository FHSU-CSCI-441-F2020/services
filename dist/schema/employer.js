"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

// User schemas
var _default = (0, _apolloServerExpress.gql)`
  extend type Query {
    getEmployer(id: ID!): Employer!
    getEmployers: [Employer!]
  }

  extend type Mutation {
    registerEmployer(
      name: String!
      email: String!
      phoneNumber: String!
      owner: String!
      address1: String!
      address2: String
      city: String!
      state: String!
      zip: Int!
      country: String!
    ): EmployerDetails

    updateEmployer(
      id: ID!
      name: String
      email: String
      phoneNumber: String
      teamMembers: [String!]
      jobs: [String!]
    ): EmployerDetails
  }

  type Employer {
    id: ID!
    name: String!
    teamMembers: [String!]
    jobs: [String!]
    email: String!
    phoneNumber: String!
    owner: String!
    address: String
  }

  type Address {
    address: String!
    city: String!
    state: String!
    zip: Int!
    country: String!
  }

  type EmployerDetails {
    employer: Employer
    address: Address
  }
`;

exports.default = _default;
//# sourceMappingURL=employer.js.map