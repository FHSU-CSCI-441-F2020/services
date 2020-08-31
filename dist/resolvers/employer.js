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
      // Create address
      const address = await models.Address.create({
        address1: args.address1,
        address2: args.address2,
        city: args.city,
        state: args.state,
        zip: args.zip,
        country: args.country
      }); // Create new employer, add foreign key for address

      const employer = await models.Employer.create({
        name: args.name,
        email: args.email,
        phoneNumber: args.phoneNumber,
        owner: args.owner,
        teamMembers: [args.owner],
        jobs: [],
        address: address.id
      }); // Return employer and address as an object

      return {
        employer,
        address
      };
    }),
    // Update employer information
    updateEmployer: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated || _authorization.isAdmin, async (parent, args, {
      models
    }) => {
      // Retrieve both employer and address
      let employer = await models.Employer.findByPk(args.id);
      let address = await models.Address.findByPk(employer.address); // Check each possible arguments for changes

      const newName = args.name ? args.name : employer.name;
      const newEmail = args.email ? args.email : employer.email;
      const newPhoneNumber = args.phoneNumber ? args.phoneNumber : employer.phoneNumber;
      const newTeamMembers = args.teamMembers ? args.teamMembers : employer.teamMembers;
      const newJobs = args.jobs ? args.jobs : employer.jobs;
      const newAddress1 = args.address1 ? args.address1 : address.address1;
      const newAddress2 = args.address2 ? args.address2 : address.address2;
      const newCity = args.city ? args.city : address.city;
      const newState = args.state ? args.state : address.state;
      const newZip = args.zip ? args.zip : address.zip;
      const newCountry = args.country ? args.country : address.country; // Update employer if data changed

      employer = await employer.update({
        name: newName,
        email: newEmail,
        phoneNumber: newPhoneNumber,
        teamMembers: newTeamMembers,
        jobs: newJobs
      }); // Update address if data changed

      address = await address.update({
        address1: newAddress1,
        address2: newAddress2,
        city: newCity,
        state: newState,
        zip: newZip,
        country: newCountry
      }); // Return employer and address as an object

      return {
        employer,
        address
      };
    })
  }
};
exports.default = _default;
//# sourceMappingURL=employer.js.map