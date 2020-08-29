import { gql } from "apollo-server-express";

// User schemas
export default gql`
  extend type Query {
    getEmployer(id: ID!): Employer
  }

  extend type Mutation {
    registerEmployer(
      name: String!
      email: String!
      phoneNumber: String!
    ): Employer
  }

  type Employer {
    id: ID!
    name: String!
    admins: [String!]!
    jobs: [Int!]
    email: String!
    phoneNumber: String!
  }
`;
