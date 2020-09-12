import { gql } from "apollo-server-express";

// User schemas
export default gql`
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
      completedProfile: Boolean
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
