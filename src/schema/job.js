import { gql } from "apollo-server-express";

// Job schemas
export default gql`
  extend type Query {
    getJob(id: ID!): Job!
    getJobs(active: Boolean, owner: String): [Job!]
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
    ): Boolean
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
    hours: String
    applicants: [String]
    owner: String
    active: Boolean
  }
`;
