// Allow for date scalar
import { GraphQLDateTime } from "graphql-iso-date";
// Import User and Message resolvers
import userResolvers from "./user";
import messageResolvers from "./message";
import employerResolvers from "./employer";
import userProfileResolver from "./userProfile";
import jobResolver from "./job";

// Create date with graphql scalar
const customScalarResolver = {
  Date: GraphQLDateTime,
};

// Export all resolvers
export default [
  customScalarResolver,
  userResolvers,
  messageResolvers,
  employerResolvers,
  userProfileResolver,
  jobResolver,
];
