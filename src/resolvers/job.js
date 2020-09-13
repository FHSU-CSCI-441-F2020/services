
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
    //get a single job
    getJob:(parent, {id}, {models}) => models.Job.findOne({where: {id}}),
    //get all jobs
    getAllJobs:(parent, args, {models}) => models.Job.findAll(),
  },
  Mutation:{
    //createjob
    createJob: async (parent, args, {models, user}) => {
      try{
       await models.Job.create({...args, owner: user.id});
       return true;
     }catch(err){
       console.log(err);
       return false;
     }
    },
    updateJob: async (parent, args, {models}) => {
      isAuthenticated || isAdmin,
        job = models.Job.findByPk(args.id).then( job => {
          if(!job){
            throw new Error("not found");
          }else{
            job.update({
              name: args.name || job.name,
              description: args.description || job.description,
              requirements: args.requirements || job.requirements,
              location: args.location || job.location,
              hours: args.hours || job.hours,
            })
          }
        })
    },
    deleteJob: combineResolvers(
        isAuthenticated || isAdmin,
        async (parent, { id }, { models }) => {
          return await models.Job.destroy({
            where: { id },
          });
        }
      ),
  },
};
