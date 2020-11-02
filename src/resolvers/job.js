// Allow for authentications
import { combineResolvers } from "graphql-resolvers";
// Apollo error handling
import { AuthenticationError, EmployerInputError } from "apollo-server";
// Check if user has admin role
import {
  isAdmin,
  isAuthenticated,
  isEmployer,
  isAuthEmployee,
} from "./authorization";

export default {
  Query: {
    // Single Job
    getJob: async (parent, { id }, { models }) => {
      return await models.Job.findByPk(id);
    },
    // All Jobs
    getJobs: async (parent, args, { models }) => {
      return await models.Job.findAll({ where: { ...args } });
    },
  },
  Mutation: {
    createJob: combineResolvers(
      isAuthenticated || isAdmin,
      async (parent, args, { models, me }) => {
        const job = await models.Job.create({
          ...args,
          applicants: [],
          owner: me.id,
          active: true,
        });

        if (job.id) {
          return true;
        } else {
          return false;
        }
      }
    ),
  },
};
