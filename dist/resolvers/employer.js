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
    // Single Employer
    getEmployer: async (parent, {
      id
    }, {
      models
    }) => {
      return await models.Employer.findByPk(id);
    },
    // All Employers
    getEmployers: async (parent, args, {
      models
    }) => {
      return await models.Employer.findAll();
    }
  },
  Mutation: {
    // Create new employer
    registerEmployer: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated || _authorization.isAdmin, async (parent, args, {
      models
    }) => {
      // Create new employer
      const employer = await models.Employer.create({
        name: args.name,
        email: args.email,
        phoneNumber: args.phoneNumber,
        owner: args.owner,
        teamMembers: [args.owner],
        jobs: [],
        address1: args.address1,
        address2: args.address2,
        city: args.city,
        state: args.state,
        zip: args.zip,
        country: args.country
      }); // Return employer

      return employer;
    }),
    // Update employer information
    updateEmployer: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated || _authorization.isAdmin, async (parent, args, {
      models
    }) => {
      // Retrieve employer
      let employer = await models.Employer.findByPk(args.id); // Check each possible arguments for changes

      const newName = args.name ? args.name : employer.name;
      const newEmail = args.email ? args.email : employer.email;
      const newPhoneNumber = args.phoneNumber ? args.phoneNumber : employer.phoneNumber;
      const newTeamMembers = args.teamMembers ? args.teamMembers : employer.teamMembers;
      const newJobs = args.jobs ? args.jobs : employer.jobs;
      const newAddress1 = args.address1 ? args.address1 : employer.address1;
      const newAddress2 = args.address2 ? args.address2 : employer.address2;
      const newCity = args.city ? args.city : employer.city;
      const newState = args.state ? args.state : employer.state;
      const newZip = args.zip ? args.zip : employer.zip;
      const newCountry = args.country ? args.country : employer.country; // Update employer if data changed

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
        country: newCountry
      }); // Return employer

      return employer;
    })
  }
};
exports.default = _default;
//# sourceMappingURL=employer.js.map