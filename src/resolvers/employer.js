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
  isAuthEmployee,
} from "./authorization";

export default {
  Query: {
    // Single Employer
    getEmployer: async (parent, { id }, { models }) => {
      return await models.Employer.findByPk(id);
    },
    // All Employers
    getEmployers: async (parent, args, { models }) => {
      return await models.Employer.findAll();
    },
  },
  Mutation: {
    // Create new employer
    registerEmployer: combineResolvers(
      isAuthenticated || isAdmin,
      async (parent, args, { models, me }) => {
        const user = await models.User.findByPk(me.id);
        const employer = await models.Employer.create({
          ...args,
          jobs: [],
          owner: user.id,
        });
        await user.update({
          role: "employer",
        });
        return true;
      }
    ),
    // Update employer information
    updateEmployer: combineResolvers(
      isAuthenticated || isAdmin,
      async (parent, args, { models }) => {
        // Retrieve employer
        let employer = await models.Employer.findByPk(args.id);

        // Check each possible arguments for changes
        const newName = args.name ? args.name : employer.name;
        const newEmail = args.email ? args.email : employer.email;
        const newPhoneNumber = args.phoneNumber
          ? args.phoneNumber
          : employer.phoneNumber;
        const newTeamMembers = args.teamMembers
          ? args.teamMembers
          : employer.teamMembers;
        const newJobs = args.jobs ? args.jobs : employer.jobs;
        const newAddress1 = args.address1 ? args.address1 : employer.address1;
        const newAddress2 = args.address2 ? args.address2 : employer.address2;
        const newCity = args.city ? args.city : employer.city;
        const newState = args.state ? args.state : employer.state;
        const newZip = args.zip ? args.zip : employer.zip;
        const newCountry = args.country ? args.country : employer.country;

        // Update employer if data changed
        employer = await employer.update({
          name: newName,
          email: newEmail,
          phoneNumber: newPhoneNumber,
          teamMembers: newTeamMembers,
          jobs: newJobs,
          address1: newAddress1,
          address2: newAddress2,
          city: newCity,
          state: newState,
          zip: newZip,
          country: newCountry,
        });

        // Return employer
        return employer;
      }
    ),
  },
};
