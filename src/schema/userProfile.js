import { gql } from "apollo-server-express";

// User schemas
export default gql`
  extend type Query {
    getUserProfile(userId: String!): userProfile
    getUserProfiles(active: Boolean): [userProfile!]
  }

  extend type Mutation {
    createProfile(
      userId: String!
      statement: String!
      education: [JSON]!
      workExperience: [JSON]!
      lookingFor: [String]!
      skills: [String]!
      active: Boolean!
      address1: String
      address2: String
      city: String!
      state: String!
      zip: Int!
      country: String!
    ): userProfile

    updateProfile(
      id: ID!
      statement: String
      education: [JSON!]
      workExperience: [JSON!]
      lookingFor: [String!]
      skills: [String]
      active: Boolean
      address1: String
      address2: String
      city: String
      state: String
      zip: Int
      country: String
    ): userProfile
  }

  type userProfile {
    id: ID
    statement: String
    education: [JSON]
    workExperience: [JSON]
    lookingFor: [JSON]
    skills: [JSON]
    active: Boolean!
    address1: String
    address2: String
    city: String
    state: String
    zip: Int
    country: String
    userId: String
  }
`;
