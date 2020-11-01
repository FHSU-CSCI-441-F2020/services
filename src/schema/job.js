import { gql } from "apollo-server-express";
//crud
// User schemas
export default gql`
  extend type Query {
    getJob(id: ID!): Job!
    getAllJobs: [Job!]!
  }

  extend type Mutation {
    createJob(
      name: String
      description: String
      requirements: String
      city: String
      state: String
      zip: Int
      country: String
      hours: String
    ): Boolean!
  }

  type Job {
    id: ID
    name: String
    description: String
    requirements: String
    city: String
    state: String
    zip: Int
    country: String
    hours: String!
    applicants: [User!]
    active: Boolean!
  }
`;
