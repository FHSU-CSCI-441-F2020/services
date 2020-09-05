// Apollo error handling
import { ForbiddenError } from "apollo-server";
// Allow for authorizations and null returns
import { combineResolvers, skip } from "graphql-resolvers";

// Verify user is authenticated
export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError("Not authenticated as user.");

// Verify is user is admin
export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === "ADMIN" ? skip : new ForbiddenError("Not authorized as admin.")
);

// Check if message is owned by user
export const isMessageOwner = async (parent, { id }, { models, me }) => {
  const message = await models.Message.findByPk(id, { raw: true });

  if (message.userId !== me.id) {
    throw new ForbiddenError("Not authenticated as owner.");
  }

  return skip;
};

// Check if user is current user
export const isUser = async (parent, { id }, { models, me }) => {
  const user = await models.User.findByPk(id, { raw: true });

  if (user.id !== me.id) {
    throw new ForbiddenError("Not authenticated as user.");
  }

  return skip;
};
// Check if user is current owner or team member
export const isAuthEmployee = async (parent, { id }, { models, me }) => {
  const employer = await models.Employer.findByPk(id, { raw: true });

  if (employer.owner !== me.id) {
    throw new ForbiddenError("Not authenticated as user.");
  }
  // && !_.includes(employer.teamMembers, me.id)
  return skip;
};
