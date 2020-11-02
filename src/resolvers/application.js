
// Generate token
import jwt from "jsonwebtoken";
// Allow for authentications
import { combineResolvers } from "graphql-resolvers";
// Apollo error handling
import { AuthenticationError, UserInputError } from "apollo-server";
// Check if user has admin role
import { isAdmin, isAuthenticated, isUser } from "./authorization";

export default{
  Query:{
    //get a single Application
    getApplication:(parent, {id}, {models}) => models.Application.findOne({where: {id}}),
    //get all Applications
    getAllApplications:(parent, args, {models}) => models.Application.findAll(),
  },
  Mutation:{
    //createApplication
    createApplication: async (parent, args, {models, me}) => {
      try{
       await models.Application.create({...args, owner: me.id});
       return true;
     }catch(err){
       console.log(err);
       return false;
     }
    },
    deleteApplication: combineResolvers(
      isAuthenticated || isAdmin,
        async (parent, { id }, { models }) => {
          return await models.Application.destroy({
            where: { id },
          });
        }
      ),
  },
};

