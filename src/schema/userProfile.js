import { gql } from "apollo-server-express";

// User schemas
export default gql`
  extend type Query {
    getUserProfile(userId: ID!): UserProfile
    getUserProfiles(active: Boolean): [UserProfile!]
    getProfile(id: ID!): CompleteProfile
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
    ): UserProfile!

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
    ): UserProfile
  }

  type UserProfile {
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

  type CompleteProfile {
    user: User
    userProfile: UserProfile
  }
`;
