// Allow for authentications
import { combineResolvers } from "graphql-resolvers";
// Apollo error handling
import { AuthenticationError, UserProfileInputError } from "apollo-server";
// Check if user has admin role
import {
  isAdmin,
  isAuthenticated,
  isUserProfile,
  isAuthEmployee,
} from "./authorization";

export default {
  Query: {
    // Single UserProfile
    getUserProfile: async (parent, { userId }, { models }) => {
      const userProfile = await models.UserProfile.findAll({
        where: {
          userId: userId,
        },
      });
      console.log(userProfile);
      // Return single user
      return userProfile[0];
    },
    // All UserProfiles
    getUserProfiles: async (parent, { active }, { models }) => {
      let userProfile;
      console.log(active);
      if (active) {
        userProfile = await models.UserProfile.findAll({
          where: {
            active: active,
          },
        });
      } else {
        userProfile = await models.UserProfile.findAll();
      }

      return userProfile;
    },
  },
  Mutation: {
    // Create new userProfile
    createProfile: combineResolvers(
      isAuthenticated || isAdmin,
      async (parent, args, { models }) => {
        // Create new userProfile
        const userProfile = await models.UserProfile.create({
          userId: args.userId,
          statement: args.statement,
          education: [args.education],
          workExperience: [args.workExperience],
          lookingFor: [args.lookingFor],
          skills: [args.skills],
          active: args.active,
          address1: args.address1,
          address2: args.address2,
          city: args.city,
          state: args.state,
          zip: args.zip,
          country: args.country,
        });

        // Return userProfile and address as an object
        return userProfile;
      }
    ),
    // Update userProfile information
    updateProfile: combineResolvers(
      isAuthenticated || isAdmin,
      async (parent, args, { models }) => {
        // Retrieve both userProfile and address
        let userProfile = await models.UserProfile.findByPk(args.id);
        // Check each possible arguments for changes
        const newStatement = args.statement
          ? args.statement
          : userProfile.statement;
        const newEducation = args.education
          ? args.education
          : userProfile.education;
        const newWorkExperience = args.workExperience
          ? args.workExperience
          : userProfile.workExperience;
        const newLookingFor = args.lookingFor
          ? args.lookingFor
          : userProfile.lookingFor;
        const newSkills = args.skills ? args.skills : userProfile.skills;
        const newActive = args.active ? args.active : userProfile.active;
        const newAddress1 = args.address1 ? args.address1 : address.address1;
        const newAddress2 = args.address2 ? args.address2 : address.address2;
        const newCity = args.city ? args.city : address.city;
        const newState = args.state ? args.state : address.state;
        const newZip = args.zip ? args.zip : address.zip;
        const newCountry = args.country ? args.country : address.country;

        // Update userProfile if data changed
        userProfile = await userProfile.update({
          statement: newStatement,
          education: newEducation,
          workExperience: newWorkExperience,
          lookingFor: newLookingFor,
          skills: newSkills,
          active: newActive,
          address1: newAddress1,
          address2: newAddress2,
          city: newCity,
          state: newState,
          zip: newZip,
          country: newCountry,
        });

        // Update address if data changed
        address = await address.update({
          address1: newAddress1,
          address2: newAddress2,
          city: newCity,
          state: newState,
          zip: newZip,
          country: newCountry,
        });

        // Return userProfile and address as an object
        return userProfile;
      }
    ),
  },
};
