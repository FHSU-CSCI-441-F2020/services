"use strict";

var _express = _interopRequireDefault(require("express"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _apolloServerExpress = require("apollo-server-express");

var _schema = _interopRequireDefault(require("./schema"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _models = _interopRequireWildcard(require("./models"));

var _cors = _interopRequireDefault(require("cors"));

var _http = _interopRequireDefault(require("http"));

var _dataloader = _interopRequireDefault(require("dataloader"));

var _loaders = _interopRequireDefault(require("./loaders"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Token generation
// Import required modules for Apollo/GraphQL
// Allow for cross-domain request
// Allow transfer of data over HTTP
// import { createDeflateRaw } from "zlib";
// set app variable to express main function
const app = (0, _express.default)(); // Allow cross domain request

app.use((0, _cors.default)()); // Set current user

const getMe = async req => {
  // token from header
  const token = req.headers["x-token"]; // If token is found

  if (token) {
    // Verify token matches secret token
    try {
      return await _jsonwebtoken.default.verify(token, process.env.SECRET);
    } catch (e) {
      throw new _apolloServerExpress.AuthenticationError("Your session expired. Sign in again.");
    }
  }
}; // Init apollo server with schema and resolvers


const server = new _apolloServerExpress.ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: _schema.default,
  resolvers: _resolvers.default,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message.replace("SequelizeValidationError: ", "").replace("Validation error: ", "");
    return { ...error,
      message
    };
  },
  context: async ({
    req,
    connection
  }) => {
    if (connection) {
      return {
        models: _models.default,
        loaders: {
          user: new _dataloader.default(keys => _loaders.default.user.batchUsers(keys, _models.default))
        }
      };
    }

    if (req) {
      const me = await getMe(req);
      return {
        models: _models.default,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new _dataloader.default(keys => _loaders.default.user.batchUsers(keys, _models.default))
        }
      };
    }
  }
}); // Set API path and include express as middleware

server.applyMiddleware({
  app,
  path: "/graphql"
}); // Init http server to handle subscriptions

const httpServer = _http.default.createServer(app);

server.installSubscriptionHandlers(httpServer); // Check if using testing database

const isDevelopment = !!process.env.DATABASE_DEVELOP; // Check if production database in use

const isProduction = !!process.env.DATABASE_URL; // Port based on prod or dev environment

const port = process.env.PORT || 8000; // Connect to postgres database through sequelize

_models.sequelize.sync({
  force: isDevelopment,
  logging: false
}).then(async () => {
  // sequelize.sync({ force: isTest }).then(async () => {
  if (isDevelopment) {
    createDefaultData();
  } // Listen on port based on prod or dev


  httpServer.listen({
    port
  }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
}); // For development, clean database, complete necessary table/column updates, add
// data for each model


async function createDefaultData() {
  await _models.default.User.create({
    username: "Admin",
    email: "admin@jobkik.com",
    password: "admin",
    firstName: "Head",
    lastName: "Admin",
    role: "admin",
    phoneNumber: "5555555555",
    completedProfile: false
  });
  await _models.default.User.create({
    username: "User",
    email: "user@jobkik.com",
    password: "password",
    firstName: "Main",
    lastName: "User",
    role: "user",
    phoneNumber: "1111111111",
    completedProfile: true
  });
  await _models.default.UserProfile.create({
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
    country: "US"
  });
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var user = _interopRequireWildcard(require("./user"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _default = {
  user
};
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.batchUsers = void 0;

// Batch users for query
const batchUsers = async (keys, models) => {
  // Get all users which match
  const users = await models.User.findAll({
    where: {
      id: {
        $in: keys
      }
    }
  });
  return keys.map(key => users.find(user => user.id === key));
};

exports.batchUsers = batchUsers;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Define employer model with validation
const employer = (sequelize, DataTypes) => {
  const Employer = sequelize.define("employer", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    teamMembers: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    owner: {
      type: DataTypes.STRING
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address2: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Employer.associate = models => {
    Employer.belongsTo(models.Employer);
  };

  return Employer;
};

var _default = employer;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.sequelize = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Set sequelize based on environment
let sequelize;
exports.sequelize = sequelize;

if (process.env.DATABASE_URL) {
  exports.sequelize = sequelize = new _sequelize.default(process.env.DATABASE_URL, {
    dialect: "postgres"
  });
} else {
  exports.sequelize = sequelize = new _sequelize.default(process.env.TEST_DATABASE || process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: "postgres"
  });
}

const models = {
  User: sequelize.import("./user"),
  Message: sequelize.import("./message"),
  Employer: sequelize.import("./employer"),
  UserProfile: sequelize.import("./userProfile")
}; // Create associations between modelss

Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});
var _default = models;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Define message model with validation
const message = (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    text: {
      type: DataTypes.STRING // validate: {
      //   notEmpty: {
      //     args: true,
      //     msg: "Text required for messages.",
      //   },
      //   len: {
      //     args: [5, 200],
      //     msg: "Message length of 5-200 required.",
      //   },
      // },

    }
  });

  Message.associate = models => {
    Message.belongsTo(models.User);
  };

  return Message;
};

var _default = message;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Password hash crypto
// Define user with validation requirements
const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false // validate: {
      //   notEmpty: {
      //     args: true,
      //     msg: "Username required.",
      //   },
      //   len: {
      //     args: [5, 20],
      //     msg: "Username length of 5-20 required.",
      //   },
      // },

    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false // validate: {
      //   notEmpty: true,
      //   isEmail: true,
      //   msg: "Valid email is required",
      // },

    },
    password: {
      type: DataTypes.STRING,
      allowNull: false // validate: {
      //   notEmpty: true,
      //   len: [7, 42],
      //   msg: "Password length of 7-42 required.",
      // },

    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    completedProfile: {
      type: DataTypes.BOOLEAN
    }
  }); // Delete all user messages

  User.associate = models => {
    User.hasMany(models.Message, {
      onDelete: "CASCADE"
    });
  }; // Define user by login value


  User.findByLogin = async login => {
    // Attempt to find user based on username
    let user = await User.findOne({
      where: {
        username: login
      }
    }); // If user not found my username, find by email

    if (!user) {
      user = await User.findOne({
        where: {
          email: login
        }
      });
    }

    return user;
  }; // Create hash of inputted password


  User.beforeCreate(async user => {
    user.password = await user.generatePasswordHash();
  }); // Create hash of inputted password

  User.beforeUpdate(async user => {
    user.password = await user.generatePasswordHash();
  }); // Generate password hash using bcrypt

  User.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    return await _bcrypt.default.hash(this.password, saltRounds);
  }; // Validate stored user password with user input


  User.prototype.validatePassword = async function (password) {
    return await _bcrypt.default.compare(password, this.password);
  };

  return User;
};

var _default = user;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Define userProfile model with validation
const userProfile = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define("userProfile", {
    statement: {
      type: DataTypes.STRING
    },
    education: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    workExperience: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    lookingFor: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    active: {
      type: DataTypes.BOOLEAN
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address2: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING
    }
  });

  UserProfile.associate = models => {
    UserProfile.belongsTo(models.UserProfile);
  };

  return UserProfile;
};

var _default = userProfile;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAuthEmployee = exports.isUser = exports.isMessageOwner = exports.isAdmin = exports.isAuthenticated = void 0;

var _apolloServer = require("apollo-server");

var _graphqlResolvers = require("graphql-resolvers");

// Apollo error handling
// Allow for authorizations and null returns
// Verify user is authenticated
const isAuthenticated = (parent, args, {
  me
}) => me ? _graphqlResolvers.skip : new _apolloServer.ForbiddenError("Not authenticated as user."); // Verify is user is admin


exports.isAuthenticated = isAuthenticated;
const isAdmin = (0, _graphqlResolvers.combineResolvers)(isAuthenticated, (parent, args, {
  me: {
    role
  }
}) => role === "ADMIN" ? _graphqlResolvers.skip : new _apolloServer.ForbiddenError("Not authorized as admin.")); // Check if message is owned by user

exports.isAdmin = isAdmin;

const isMessageOwner = async (parent, {
  id
}, {
  models,
  me
}) => {
  const message = await models.Message.findByPk(id, {
    raw: true
  });

  if (message.userId !== me.id) {
    throw new _apolloServer.ForbiddenError("Not authenticated as owner.");
  }

  return _graphqlResolvers.skip;
}; // Check if user is current user


exports.isMessageOwner = isMessageOwner;

const isUser = async (parent, {
  id
}, {
  models,
  me
}) => {
  const user = await models.User.findByPk(id, {
    raw: true
  });

  if (user.id !== me.id) {
    throw new _apolloServer.ForbiddenError("Not authenticated as user.");
  }

  return _graphqlResolvers.skip;
}; // Check if user is current owner or team member


exports.isUser = isUser;

const isAuthEmployee = async (parent, {
  id
}, {
  models,
  me
}) => {
  const employer = await models.Employer.findByPk(id, {
    raw: true
  });

  if (employer.owner !== me.id) {
    throw new _apolloServer.ForbiddenError("Not authenticated as user.");
  } // && !_.includes(employer.teamMembers, me.id)


  return _graphqlResolvers.skip;
};

exports.isAuthEmployee = isAuthEmployee;
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Allow for date scalar
// Import User and Message resolvers
// Create date with graphql scalar
const customScalarResolver = {
  Date: _graphqlIsoDate.GraphQLDateTime
}; // Export all resolvers

var _default = [customScalarResolver, _user.default, _message.default, _employer.default, _userProfile.default];
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphqlResolvers = require("graphql-resolvers");

var _authorization = require("./authorization");

var _sequelize = _interopRequireDefault(require("sequelize"));

var _subscription = _interopRequireWildcard(require("../subscription"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Allow for authentication checks
// Custom authentication methods
// Implement cursor pagination
// Subscription services for messages
// Date variables of cursor to/from hash
const toCursorHash = string => Buffer.from(string).toString("base64");

const fromCursorHash = string => Buffer.from(string, "base64").toString("ascii");

var _default = {
  // Base query's
  Query: {
    // Multiple Messages
    messages: async (parent, {
      cursor,
      limit = 100
    }, {
      models
    }) => {
      // If cursor, set location point else no options
      const cursorOptions = cursor ? {
        where: {
          createdAt: {
            [_sequelize.default.Op.lt]: fromCursorHash(cursor)
          }
        }
      } : {}; // Return messages from cursor upto limit plus 1

      const messages = await models.Message.findAll({
        order: [["createdAt", "DESC"]],
        limit: limit + 1,
        ...cursorOptions
      }); // Set if more messages are available

      const hasNextPage = messages.length > limit; // Set messages to edges based on if more messaged exist

      const edges = hasNextPage ? messages.slice(0, -1) : messages;
      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString())
        }
      };
    },
    // Single Message
    message: async (parent, {
      id
    }, {
      models
    }) => {
      return await models.Message.findByPk(id);
    }
  },
  // Create, Update and Delete Mutations
  Mutation: {
    createMessage: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated, async (parent, {
      text
    }, {
      models,
      me
    }) => {
      const message = await models.Message.create({
        text,
        userId: me.id
      });

      _subscription.default.publish(_subscription.EVENTS.MESSAGE.CREATED, {
        messageCreated: {
          message
        }
      });

      return message;
    }),
    // Return boolean if delete is successful
    deleteMessage: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated, _authorization.isMessageOwner, async (parent, {
      id
    }, {
      models
    }) => {
      return await models.Message.destroy({
        where: {
          id
        }
      });
    }),
    updateMessage: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated, _authorization.isMessageOwner, async (parent, {
      id,
      text
    }, {
      models
    }) => {
      // Update message with user input and return updated message
      return await models.Message.update({
        text: text
      }, {
        where: {
          id: id
        },
        returning: true
      }).then(message => {
        return message[1][0].dataValues;
      });
    })
  },
  // Define Message type return value
  Message: {
    // Return user object matching message userId
    user: async (message, args, {
      models
    }) => {
      return await models.User.findByPk(message.userId);
    }
  },
  // Subscription services
  Subscription: {
    messageCreated: {
      subscribe: () => _subscription.default.asyncIterator(_subscription.EVENTS.MESSAGE.CREATED)
    }
  }
};
exports.default = _default;
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
      user.completedProfile = args.completedProfile ? args.completedProfile : user.completedProfile;
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphqlResolvers = require("graphql-resolvers");

var _apolloServer = require("apollo-server");

var _authorization = require("./authorization");

// Allow for authentications
// Apollo error handling
// Check if user has admin role
var _default = {
  Query: {
    // Single UserProfile
    getUserProfile: async (parent, {
      userId
    }, {
      models
    }) => {
      const userProfile = await models.UserProfile.findAll({
        where: {
          userId: userId
        }
      });
      console.log(userProfile); // Return single user

      return userProfile[0];
    },
    // All UserProfiles
    getUserProfiles: async (parent, {
      active
    }, {
      models
    }) => {
      let userProfile;
      console.log(active);

      if (active) {
        userProfile = await models.UserProfile.findAll({
          where: {
            active: active
          }
        });
      } else {
        userProfile = await models.UserProfile.findAll();
      }

      return userProfile;
    }
  },
  Mutation: {
    // Create new userProfile
    createProfile: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated || _authorization.isAdmin, async (parent, args, {
      models
    }) => {
      // Create new userProfile
      const userProfile = await models.UserProfile.create({
        userId: args.userId,
        statement: args.statement,
        education: [args.education],
        workExperience: [args.workExperience],
        lookingFor: [args.lookingFor],
        skills: [args.skills],
        active: args.active,
        address1: args.address1,
        address2: args.address2,
        city: args.city,
        state: args.state,
        zip: args.zip,
        country: args.country
      }); // Return userProfile and address as an object

      return userProfile;
    }),
    // Update userProfile information
    updateProfile: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated || _authorization.isAdmin, async (parent, args, {
      models
    }) => {
      // Retrieve both userProfile and address
      let userProfile = await models.UserProfile.findByPk(args.id); // Check each possible arguments for changes

      const newStatement = args.statement ? args.statement : userProfile.statement;
      const newEducation = args.education ? args.education : userProfile.education;
      const newWorkExperience = args.workExperience ? args.workExperience : userProfile.workExperience;
      const newLookingFor = args.lookingFor ? args.lookingFor : userProfile.lookingFor;
      const newSkills = args.skills ? args.skills : userProfile.skills;
      const newActive = args.active ? args.active : userProfile.active;
      const newAddress1 = args.address1 ? args.address1 : address.address1;
      const newAddress2 = args.address2 ? args.address2 : address.address2;
      const newCity = args.city ? args.city : address.city;
      const newState = args.state ? args.state : address.state;
      const newZip = args.zip ? args.zip : address.zip;
      const newCountry = args.country ? args.country : address.country; // Update userProfile if data changed

      userProfile = await userProfile.update({
        statement: newStatement,
        education: newEducation,
        workExperience: newWorkExperience,
        lookingFor: newLookingFor,
        skills: newSkills,
        active: newActive,
        address1: newAddress1,
        address2: newAddress2,
        city: newCity,
        state: newState,
        zip: newZip,
        country: newCountry
      }); // Update address if data changed

      address = await address.update({
        address1: newAddress1,
        address2: newAddress2,
        city: newCity,
        state: newState,
        zip: newZip,
        country: newCountry
      }); // Return userProfile and address as an object

      return userProfile;
    })
  }
};
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

// User schemas
var _default = (0, _apolloServerExpress.gql)`
  extend type Query {
    getEmployer(id: ID!): Employer!
    getEmployers: [Employer!]
  }

  extend type Mutation {
    registerEmployer(
      name: String!
      email: String!
      phoneNumber: String!
      owner: String!
      address1: String
      address2: String
      city: String!
      state: String!
      zip: Int!
      country: String!
    ): Employer!

    updateEmployer(
      id: ID!
      name: String
      email: String
      phoneNumber: String
      owner: String
      address1: String
      address2: String
      city: String
      state: String
      zip: Int
      country: String
    ): Employer
  }

  type Employer {
    id: ID
    name: String
    teamMembers: [String!]
    jobs: [String!]
    email: String!
    phoneNumber: String
    owner: String
    address1: String
    address2: String
    city: String
    state: String
    zip: Int
    country: String
  }
`;

exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _user = _interopRequireDefault(require("./user"));

var _message = _interopRequireDefault(require("./message"));

var _employer = _interopRequireDefault(require("./employer"));

var _userProfile = _interopRequireDefault(require("./userProfile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Import User and Message schemas
// Link available Schemas
const linkSchema = (0, _apolloServerExpress.gql)`
  scalar Date

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
var _default = [linkSchema, _user.default, _message.default, _employer.default, _userProfile.default];
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

// Messages schemas
var _default = (0, _apolloServerExpress.gql)`
  extend type Query {
    messages(cursor: String, limit: Int): MessageConnection!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(id: ID!, text: String!): Message!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Message {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type MessageCreated {
    message: Message!
  }
`;

exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

// User schemas
var _default = (0, _apolloServerExpress.gql)`
  extend type Query {
    getUser(id: ID!): User
    getUsers: [User!]
    me: User
  }

  extend type Mutation {
    registerUser(
      username: String
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      phoneNumber: String
      role: String!
    ): NewUser!

    loginUser(login: String!, password: String!): NewUser

    updateUser(
      id: ID!
      username: String
      email: String
      password: String
      firstName: String
      lastName: String
      phoneNumber: String
      role: String
    ): User!

    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    phoneNumber: String
    role: String!
    messages: [Message!]
    completedProfile: Boolean
  }

  type NewUser {
    user: User
    token: String!
  }
`;

exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

// User schemas
var _default = (0, _apolloServerExpress.gql)`
  extend type Query {
    getUserProfile(userId: String!): userProfile
    getUserProfiles(active: Boolean): [userProfile!]
  }

  extend type Mutation {
    createProfile(
      userId: String!
      statement: String!
      education: [String]!
      workExperience: [String]!
      lookingFor: [String]!
      skills: [String]!
      active: Boolean!
      address1: String
      address2: String
      city: String!
      state: String!
      zip: Int!
      country: String!
    ): userProfile

    updateProfile(
      id: ID!
      statement: String
      education: [String!]
      workExperience: [String!]
      lookingFor: [String!]
      skills: [String!]
      active: Boolean
      address1: String
      address2: String
      city: String
      state: String
      zip: Int
      country: String
    ): userProfile
  }

  type userProfile {
    id: ID
    statement: String
    education: [String]
    workExperience: [String]
    lookingFor: [String]
    skills: [String]
    active: Boolean!
    address1: String
    address2: String
    city: String
    state: String
    zip: Int
    country: String
    userId: String
  }
`;

exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EVENTS = void 0;

var _apolloServer = require("apollo-server");

var MESSAGE_EVENTS = _interopRequireWildcard(require("./message"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Subscription method from apollo
const EVENTS = {
  MESSAGE: MESSAGE_EVENTS
};
exports.EVENTS = EVENTS;

var _default = new _apolloServer.PubSub();

exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CREATED = void 0;
const CREATED = "CREATED";
exports.CREATED = CREATED;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.message = exports.deleteUser = exports.signUp = exports.signIn = exports.user = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Provide url request from query
// Address of API
const API_URL = "http://localhost:8000/graphql"; // Query to get user by id

const user = async (variables) => _axios.default.post(API_URL, {
  query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
          email
          role
        }
      }
    `,
  variables
}); // User sign in query


exports.user = user;

const signIn = async (variables) => await _axios.default.post(API_URL, {
  query: `
      mutation ($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          token
        }
      }
    `,
  variables
}); // User sign up query


exports.signIn = signIn;

const signUp = async (variables) => await _axios.default.post(API_URL, {
  query: `
      mutation ($username: String!, $email: String!, $password: String!) {
        signUp(username: $username, email: $email, password: $password) {
          token
        }
      }
    `,
  variables
}); // Query for deleting user


exports.signUp = signUp;

const deleteUser = async (variables, token) => _axios.default.post(API_URL, {
  query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
  variables
}, {
  headers: {
    "x-token": token
  }
}); // Query to get message by id


exports.deleteUser = deleteUser;

const message = async (variables) => _axios.default.post(API_URL, {
  query: `
      query ($id: ID!) {
        message(id: $id) {
          text
          user {
            username
            email
          }
        }
      }
    `,
  variables
});

exports.message = message;
"use strict";

var _chai = require("chai");

var messageApi = _interopRequireWildcard(require("./api"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Test module from chai
// Test cases for messages
describe("messages", () => {
  describe("message(id: String!): Message", () => {
    it("returns a message when message can be found", async () => {
      // Expected result of message search by id
      const expectedResult = {
        data: {
          message: {
            text: "Published the Road to learn React",
            user: {
              username: "rwieruch",
              email: "hello@robin.com"
            }
          }
        }
      }; // Result of message query

      const result = await messageApi.message({
        id: "1"
      }); // Compare result to expected result

      (0, _chai.expect)(result.data).to.eql(expectedResult);
    });
    it("returns error when message cannot be found", async () => {
      // Query message which does not exist
      const result = await messageApi.message({
        id: "42"
      }); // Compare result to see ensure has errors property

      (0, _chai.expect)(result.data).to.have.property("errors");
    });
  });
});
"use strict";

var _chai = require("chai");

var userApi = _interopRequireWildcard(require("./api"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Test module from chai
// Test cases for user
describe("users", () => {
  describe("user(id: String!): User", () => {
    it("returns a user when user can be found", async () => {
      // Expected results for comparison
      const expectedResult = {
        data: {
          user: {
            id: "1",
            username: "rwieruch",
            email: "hello@robin.com",
            role: "ADMIN"
          }
        }
      }; // Get data for user 1

      const result = await userApi.user({
        id: "1"
      }); // Compare expected result matches returned results

      (0, _chai.expect)(result.data).to.eql(expectedResult);
    });
    it("returns null when user cannot be found", async () => {
      const expectedResult = {
        data: {
          user: null
        }
      }; // Get user which doesn't exist

      const result = await userApi.user({
        id: "42"
      }); // compare expected results match returned results

      (0, _chai.expect)(result.data).to.eql(expectedResult);
    });
  });
  describe("deleteUser(id: String!): Boolean!", () => {
    it("returns an error because only admins can delete a user", async () => {
      // Login in non admin user, set token value
      const {
        data: {
          data: {
            signIn: {
              token
            }
          }
        }
      } = await userApi.signIn({
        login: "ddavids",
        password: "ddavids"
      }); // Attempt to delete user, set error value

      const {
        data: {
          errors
        }
      } = await userApi.deleteUser({
        id: "1"
      }, token); // Compare expected error is found in error

      (0, _chai.expect)(errors[0].message).to.eql("Not authorized as admin.");
    });
  });
  describe("signUp(username: String!, email: String!, password: String!): Token", () => {
    it("returns a token for new user", async () => {
      // Result of user query
      const result = await userApi.signUp({
        username: "111111fdsaskdjbf111",
        email: "1d111111eadgsdafsddstyle@gmail.com",
        password: "deadpass2020"
      }); // Check to ensure results do not have errors property

      (0, _chai.expect)(result.data).to.not.have.property("errors");
    });
  });
});
