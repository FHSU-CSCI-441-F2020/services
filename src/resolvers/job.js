// Generate token
import jwt from "jsonwebtoken";
// Allow for authentications
import { combineResolvers } from "graphql-resolvers";
// Apollo error handling
import { AuthenticationError, UserInputError } from "apollo-server";
// Check if user has admin role
import { isAdmin, isAuthenticated, isUser } from "./authorization";

export default {
  Query: {
    //get a single job
    getJob: (parent, { id }, { models }) =>
      models.Job.findOne({ where: { id } }),
    //get all jobs
    getAllJobs: (parent, args, { models }) => models.Job.findAll(),
  },
  Mutation: {
    //createjob
    createJob: combineResolvers(
      isAuthenticated || isAdmin,
      async (parent, args, { models, me }) => {
        console.log(args);
        const job = await models.Job({
          name: "Lutd",
          description: "Job Description",
          requirements: "Jeb Requirements",
          city: "Kansas City",
          state: "MO",
          zip: 64151,
          country: "USA",
          owner: "1",
          hours: "Mon-Fri",
          active: true,
        });
        // console.log(job);
        return true;
        // try {
        //   await models.Job.create({ ...args, owner: me.id, active: true });
        //   return true;
        // } catch (err) {
        //   console.log(err);
        //   return false;
        // }
      }
    ),
  },
};
