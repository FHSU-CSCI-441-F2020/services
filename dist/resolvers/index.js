"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphqlIsoDate = require("graphql-iso-date");

var _user = _interopRequireDefault(require("./user"));

var _message = _interopRequireDefault(require("./message"));

var _employer = _interopRequireDefault(require("./employer"));

var _userProfile = _interopRequireDefault(require("./userProfile"));

var _job = _interopRequireDefault(require("./job"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Allow for date scalar
// Import User and Message resolvers
// Create date with graphql scalar
const customScalarResolver = {
  Date: _graphqlIsoDate.GraphQLDateTime
}; // Export all resolvers

var _default = [customScalarResolver, _user.default, _message.default, _employer.default, _userProfile.default, _job.default];
exports.default = _default;
//# sourceMappingURL=index.js.map