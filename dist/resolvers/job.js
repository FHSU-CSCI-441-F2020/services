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

// Generate token
// Allow for authentications
// Apollo error handling
// Check if user has admin role
var _default = {
  Query: {
    //get a single job
    getJob: (parent, {
      id
    }, {
      models
    }) => models.Job.findOne({
      where: {
        id
      }
    }),
    //get all jobs
    getAllJobs: (parent, args, {
      models
    }) => models.Job.findAll()
  },
  Mutation: {
    //createjob
    createJob: async (parent, args, {
      models,
      me
    }) => {
      try {
        await models.Job.create({ ...args,
          owner: me.id
        });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    updateJob: async (parent, args, {
      models
    }) => {
      _authorization.isAuthenticated || _authorization.isAdmin, job = models.Job.findByPk(args.id).then(job => {
        if (!job) {
          throw new Error("not found");
        } else {
          job.update({
            name: args.name || job.name,
            description: args.description || job.description,
            requirements: args.requirements || job.requirements,
            location: args.location || job.location,
            hours: args.hours || job.hours
          });
        }
      });
    },
    deleteJob: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated || _authorization.isAdmin, async (parent, {
      id
    }, {
      models
    }) => {
      return await models.Job.destroy({
        where: {
          id
        }
      });
    })
  }
};
exports.default = _default;
//# sourceMappingURL=job.js.map