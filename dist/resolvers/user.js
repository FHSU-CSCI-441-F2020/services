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

      console.log(await models.User.findByPk(me.id));
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
      role,
      phoneNumber,
      completedProfile
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
        role,
        phoneNumber,
        completedProfile
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
      }

      console.log(user); // Return token for client

      return {
        user,
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
    updateUser: (0, _graphqlResolvers.combineResolvers)(_authorization.isUser || _authorization.isAdmin, async (parent, args, {
      models
    }) => {
      console.log(args);
      let user = await models.User.findByPk(args.id);
      user.username = args.username ? args.username : user.username;
      user.email = args.email ? args.email : user.email;
      user.password = args.password ? args.password : user.password;
      user.firstName = args.firstName ? args.firstName : user.firstName;
      user.lastName = args.lastName ? args.lastName : user.lastName;
      user.role = args.role ? args.role : user.role;
      user.phoneNumber = args.phoneNumber ? args.phoneNumber : user.phoneNumber;
      user.completedProfile = args.completedProfile !== null ? args.completedProfile : user.completedProfile;
      await user.update({
        username: user.username,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        completedProfile: user.completedProfile
      });
      return await models.User.findByPk(args.id);
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