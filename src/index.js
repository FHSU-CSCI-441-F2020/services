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
const resetDB = true;
// Check if production database in use
const isProduction = !!process.env.DATABASE_URL;
// Port based on prod or dev environment
const port = process.env.PORT || 8000;

// Connect to postgres database through sequelize
sequelize.sync({ force: resetDB, logging: isProduction }).then(async () => {
  // sequelize.sync({ force: isTest }).then(async () => {
  if (resetDB) {
    createDefaultData();
  }

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

  await models.User.create({
    username: "Employer",
    email: "company@jobkik.com",
    password: "jobkik",
    firstName: "Employer",
    lastName: "User",
    role: "employer",
    phoneNumber: "5555555556",
    completedProfile: false,
  });

  await models.User.create({
    username: "johndoe",
    email: "johndoe@jobkik.com",
    password: "jobkik",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    phoneNumber: "5555555556",
    completedProfile: false,
  });
  await models.User.create({
    username: "janedoe",
    email: "janedoe@jobkik.com",
    password: "jobkik",
    firstName: "Jane",
    lastName: "Doe",
    role: "employer",
    phoneNumber: "5555555556",
    completedProfile: false,
  });

  await models.Employer.create({
    name: "Lutd",
    email: "lutd@email.com",
    phoneNumber: "1112223333",
    address1: "123 Main St",
    address2: "",
    city: "Kansas City",
    state: "MO",
    zip: 64151,
    country: "USA",
    owner: "3",
  });

  await models.Job.create({
    name: "Verizon",
    description: "Job Description",
    requirements: "Jeb Requirements",
    city: "Kansas City",
    state: "MO",
    zip: 64151,
    country: "USA",
    owner: "1",
    hours: "Mon-Fri",
    active: false,
    applicants: [5],
  });

  await models.Job.create({
    name: "ATT",
    description: "Job Description",
    requirements: "Jeb Requirements",
    city: "Kansas City",
    state: "MO",
    zip: 64151,
    country: "USA",
    owner: "1",
    hours: "Mon-Fri",
    active: true,
    applicants: [4, 5],
  });

  await models.Job.create({
    name: "T-Mobile",
    description: "Job Description",
    requirements: "Jeb Requirements",
    city: "Kansas City",
    state: "MO",
    zip: 64151,
    country: "USA",
    owner: "1",
    hours: "Mon-Sun",
    active: true,
    applicants: [],
  });

  await models.UserProfile.create({
    userId: "4",
    statement: "This is John Does statement",
    education: null,
    workExperience: null,
    lookingFor: null,
    skills: ["Python", "Angular"],
    active: true,
    address1: "123 Main",
    city: "Kansas City",
    state: "MO",
    zip: 64151,
    country: "US",
  });
}
