import { gql } from "apollo-server-express";

// Import User and Message schemas
import userSchema from "./user";
import messageSchema from "./message";
import employerSchema from "./employer";
import userProfileSchema from "./userProfile";

// Link available Schemas
const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [
  linkSchema,
  userSchema,
  messageSchema,
  employerSchema,
  userProfileSchema,
];
