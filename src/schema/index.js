import { gql } from "apollo-server-express";
import { GraphQLJSONObject } from "graphql-type-json";

// Import User and Message schemas
import userSchema from "./user";
import messageSchema from "./message";
import employerSchema from "./employer";
import userProfileSchema from "./userProfile";
import jobSchema from "./job";

// Link available Schemas
const linkSchema = gql`
  scalar Date
  scalar JSON
  scalar JSONObject

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
  jobSchema,
];
