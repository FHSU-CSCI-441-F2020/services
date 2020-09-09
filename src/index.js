import express from "express";
// Token generation
import jwt from "jsonwebtoken";
// Import required modules for Apollo/GraphQL
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";
// Allow for cross-domain request
import cors from "cors";
// Allow transfer of data over HTTP
import http from "http";
import DataLoader from "dataloader";
import loaders from "./loaders";
// import { createDeflateRaw } from "zlib";

// set app variable to express main function
const app = express();

// Allow cross domain request
app.use(cors());

// Set current user
const getMe = async (req) => {
  // token from header
  const token = req.headers["x-token"];
  // If token is found
  if (token) {
    // Verify token matches secret token
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
};

// Init apollo server with schema and resolvers
const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  formatError: (error) => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace("SequelizeValidationError: ", "")
      .replace("Validation error: ", "");

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader((keys) => loaders.user.batchUsers(keys, models)),
        },
      };
    }

    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader((keys) => loaders.user.batchUsers(keys, models)),
        },
      };
    }
  },
});

// Set API path and include express as middleware
server.applyMiddleware({ app, path: "/graphql" });

// Init http server to handle subscriptions
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// Check if using testing database
const isDevelopment = !!process.env.DATABASE_DEVELOP;
// Check if production database in use
const isProduction = !!process.env.DATABASE_URL;
// Port based on prod or dev environment
const port = process.env.PORT || 8000;

// Connect to postgres database through sequelize
sequelize.sync({ force: false, logging: true }).then(async () => {
  // sequelize.sync({ force: isTest }).then(async () => {
  // createDefaultData();
  // Listen on port based on prod or dev
  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

// For development, clean database, complete necessary table/column updates, add
// data for each model

async function createDefaultData() {
  await models.User.create({
    username: "Admin",
    email: "admin@jobkik.com",
    password: "jobkik",
    firstName: "Head",
    lastName: "Admin",
    role: "admin",
    phoneNumber: "5555555555",
    completedProfile: false,
  });

  await models.User.create({
    username: "User",
    email: "user@jobkik.com",
    password: "jobkik",
    firstName: "Main",
    lastName: "User",
    role: "user",
    phoneNumber: "1111111111",
    completedProfile: true,
  });

  await models.UserProfile.create({
    userId: "2",
    statement: "This is a statement",
    education: ["No education"],
    workExperience: ["No experience"],
    lookingFor: ["Not looking for anything"],
    skills: ["No skills"],
    active: true,
    address1: "123 Main",
    city: "Kansas City",
    state: "MO",
    zip: 64151,
    country: "US",
  });
}
