"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _graphqlTypeJson = require("graphql-type-json");

var _user = _interopRequireDefault(require("./user"));

var _message = _interopRequireDefault(require("./message"));

var _employer = _interopRequireDefault(require("./employer"));

var _userProfile = _interopRequireDefault(require("./userProfile"));

var _job = _interopRequireDefault(require("./job"));

var _application = _interopRequireDefault(require("./application"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Import User and Message schemas
// Link available Schemas
const linkSchema = (0, _apolloServerExpress.gql)`
  scalar Date
  scalar JSON
  scalar JSONObject

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;
var _default = [linkSchema, _user.default, _message.default, _employer.default, _userProfile.default, _job.default, _application.default];
exports.default = _default;
//# sourceMappingURL=index.js.map