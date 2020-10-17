"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

//crud
// User schemas
var _default = (0, _apolloServerExpress.gql)`
type Job{
  id: Int!
  name: String!,
  description: String!
  requirements: String!
  location: String!
  hours: String!
  text: String!
  applicants: [User!]!
}

extend type Query{
    getJob(id: Int!):Job!
    getAllJobs:[Job!]!
}

extend type Mutation{
  createJob(
    name: String!
    description: String!
    requirements: String!
    location: String!
    hours: String!
  ):Boolean!

  updateJob(
    id: ID!
    name: String,
    description: String
    requirements: String
    location: String
    hours: String
  ):Job

  deleteJob(id: ID!): Boolean!
}
`;

exports.default = _default;
//# sourceMappingURL=job.js.map