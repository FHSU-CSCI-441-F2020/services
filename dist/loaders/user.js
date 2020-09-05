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
//# sourceMappingURL=user.js.map