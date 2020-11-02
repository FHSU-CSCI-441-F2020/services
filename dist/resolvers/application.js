"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _graphqlResolvers = require("graphql-resolvers");

var _apolloServer = require("apollo-server");

var _authorization = require("./authorization");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
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
    deleteApplication: (0, _graphqlResolvers.combineResolvers)(
      _authorization.isAuthenticated || _authorization.isAdmin,
        async (parent, { id }, { models }) => {
          return await models.Application.destroy({
            where: { id },
          });
        }
      ),
  },
};
exports.default = _default;
