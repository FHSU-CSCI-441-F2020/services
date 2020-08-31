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
// Generate token
const createToken = async (user, secret, expiresIn) => {
  const {
    id,
    email,
    username,
    role
  } = user;
  return await _jsonwebtoken.default.sign({
    id,
    email,
    username,
    role
  }, secret, {
    expiresIn
  });
};

var _default = {
  Query: {
    // Multiple Users
    getUsers: async (parent, args, {
      models
    }) => {
      return await models.User.findAll();
    },
    // Single User
    getUser: async (parent, {
      id
    }, {
      models
    }) => {
      return await models.User.findByPk(id);
    },
    // Current User
    me: async (parent, args, {
      models,
      me
    }) => {
      if (!me) {
        return null;
      }

      return await models.User.findByPk(me.id);
    }
  },
  Mutation: {
    // Add user with hashed password
    registerUser: async (parent, {
      username,
      email,
      password,
      firstName,
      lastName,
      role
    }, {
      models,
      secret
    }) => {
      const newUser = await models.User.create({
        username,
        email,
        password,
        firstName,
        lastName,
        role
      });
      return {
        token: createToken(newUser, secret, "30 days"),
        user: newUser
      };
    },
    // Sign in user based on user input.
    loginUser: async (parent, // Login can be username or email
    {
      login,
      password
    }, {
      models,
      secret
    }) => {
      const user = await models.User.findByLogin(login); // Throw user input error if no user found

      if (!user) {
        throw new _apolloServer.UserInputError("No user found with this login credentials.");
      } // Boolean variable if password if valid


      const isValid = await user.validatePassword(password); // If password is not valid, through authentication error

      if (!isValid) {
        throw new _apolloServer.AuthenticationError("Invalid password.");
      } // Return token for client


      return {
        token: createToken(user, secret, "30 days")
      };
    },
    // Delete a user
    deleteUser: (0, _graphqlResolvers.combineResolvers)(_authorization.isUser || _authorization.isAdmin, async (parent, {
      id
    }, {
      models
    }) => {
      return await models.User.destroy({
        where: {
          id
        }
      });
    }),
    // Delete a user
    updateUser: (0, _graphqlResolvers.combineResolvers)(_authorization.isUser || _authorization.isAdmin, async (parent, {
      id,
      username,
      email,
      password,
      firstName,
      lastName,
      role
    }, {
      models
    }) => {
      let user = await models.User.findByPk(id);
      const newUsername = username ? username : user.username;
      const newEmail = email ? email : user.email;
      const newPassword = password ? password : user.password;
      const newFirstName = firstName ? firstName : user.firstName;
      const newLastName = lastName ? lastName : user.lastName;
      const newRole = role ? role : user.role;
      await user.update({
        username: newUsername,
        email: newEmail,
        password: newPassword,
        firstName: newFirstName,
        lastName: newLastName,
        role: newRole
      });
      return await models.User.findByPk(id);
    })
  },
  // Define User message type return value
  User: {
    messages: async (user, args, {
      models
    }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id
        }
      });
    }
  }
};
exports.default = _default;
//# sourceMappingURL=user.js.map