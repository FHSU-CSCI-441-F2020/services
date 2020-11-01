import { gql } from "apollo-server-express";
//crud
// User schemas
export default gql`
  type Job {
    id: Int!
    name: String!
    description: String!
    requirements: String!
    location: String!
    hours: String!
    applicants: [User!]!
  }

  extend type Query {
    getJob(id: Int!): Job!
    getAllJobs: [Job!]!
  }

  extend type Mutation {
    createJob(
      name: String!
      description: String!
      requirements: String!
      location: String!
      hours: String!
    ): Boolean!

    updateJob(
      id: ID!
      name: String
      description: String
      requirements: String
      location: String
      hours: String
    ): Job

    deleteJob(id: ID!): Boolean!
  }
`;
