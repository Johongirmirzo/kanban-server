const { gql } = require("apollo-server");
const userResolvers = require("./userResolver");
const boardResolvers = require("./boardResolver");
const taskResolvers = require("./taskResolvers");
const User = require("../../models/User");

const resolvers = {
  Mutation: {
    ...userResolvers.Mutation,
    ...boardResolvers.Mutation,
    ...taskResolvers.Mutation,
  },
  Query: {
    ...boardResolvers.Query,
  },
  Board: {
    async user(parent) {
      return await User.findById({ _id: parent.user });
    },
  },
};

module.exports = resolvers;
