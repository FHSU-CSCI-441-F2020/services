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
//# sourceMappingURL=index.js.map