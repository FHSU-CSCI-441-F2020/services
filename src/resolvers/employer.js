// Generate token
import jwt from "jsonwebtoken";
// Allow for authentications
import { combineResolvers } from "graphql-resolvers";
// Apollo error handling
import { AuthenticationError, EmployerInputError } from "apollo-server";
// Check if user has admin role
import {
  isAdmin,
  isAuthenticated,
  isEmployer,
  isMessageOwner,
} from "./authorization";

export default {
  Query: {
    // Single Employer
    getEmployer: async (parent, { id }, { models }) => {
      return await models.Employer.findByPk(id);
    },
  },
  Mutation: {
    // Add user with hashed password
    registerEmployer: async (
      parent,
      { name, email, phoneNumber },
      { models, me }
    ) => {
      console.log(me);
      const newEmployer = await models.Employer.create({
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        admin: me.id,
      });

      const employer = await models.Employer.findAll({
        where: {
          name: name,
        },
      });
      console.log(employer);
      return employer[0];
    },
  },
};
