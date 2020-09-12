// Generate token
import jwt from "jsonwebtoken";
// Allow for authentications
import { combineResolvers } from "graphql-resolvers";
// Apollo error handling
import { AuthenticationError, UserInputError } from "apollo-server";
// Check if user has admin role
import { isAdmin, isAuthenticated, isUser } from "./authorization";

// Generate token
const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    // Multiple Users
    getUsers: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
    // Single User
    getUser: async (parent, { id }, { models }) => {
      return await models.User.findByPk(id);
    },
    // Current User
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      console.log(await models.User.findByPk(me.id));
      return await models.User.findByPk(me.id);
    },
  },
  Mutation: {
    // Add user with hashed password
    registerUser: async (
      parent,
      {
        username,
        email,
        password,
        firstName,
        lastName,
        role,
        phoneNumber,
        completedProfile,
      },
      { models, secret }
    ) => {
      const newUser = await models.User.create({
        username,
        email,
        password,
        firstName,
        lastName,
        role,
        phoneNumber,
        completedProfile,
      });

      return {
        token: createToken(newUser, secret, "30 days"),
        user: newUser,
      };
    },
    // Sign in user based on user input.
    loginUser: async (
      parent,
      // Login can be username or email
      { login, password },
      { models, secret }
    ) => {
      const user = await models.User.findByLogin(login);
      // Throw user input error if no user found
      if (!user) {
        throw new UserInputError("No user found with this login credentials.");
      }

      // Boolean variable if password if valid
      const isValid = await user.validatePassword(password);

      // If password is not valid, through authentication error
      if (!isValid) {
        throw new AuthenticationError("Invalid password.");
      }
      console.log(user);
      // Return token for client
      return { user, token: createToken(user, secret, "30 days") };
    },
    // Delete a user
    deleteUser: combineResolvers(
      isUser || isAdmin,
      async (parent, { id }, { models }) => {
        return await models.User.destroy({
          where: { id },
        });
      }
    ),
    // Delete a user
    updateUser: combineResolvers(
      isUser || isAdmin,
      async (parent, args, { models }) => {
        console.log(args);
        let user = await models.User.findByPk(args.id);

        user.username = args.username ? args.username : user.username;
        user.email = args.email ? args.email : user.email;
        user.password = args.password ? args.password : user.password;
        user.firstName = args.firstName ? args.firstName : user.firstName;
        user.lastName = args.lastName ? args.lastName : user.lastName;
        user.role = args.role ? args.role : user.role;
        user.phoneNumber = args.phoneNumber
          ? args.phoneNumber
          : user.phoneNumber;
        user.completedProfile = args.completedProfile !== null
          ? args.completedProfile
          : user.completedProfile;

        await user.update({
          username: user.username,
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phoneNumber: user.phoneNumber,
          completedProfile: user.completedProfile,
        });

        return await models.User.findByPk(args.id);
      }
    ),
  },
  // Define User message type return value
  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};
