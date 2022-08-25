const { gql, UserInputError, AuthenticationError } = require("apollo-server");
const User = require("../../models/User");
const Board = require("../../models/Board");
const authenticateUser = require("../../utils/userAuthenticate");

const resolvers = {
  Query: {
    async boards(parent, args, context) {
      const user = authenticateUser(context);
      console.log(user);
      return await Board.find({ user: user.id });
    },
    async board(parent, { boardId }, context) {
      const user = authenticateUser(context);
      const board = await Board.findById({ _id: boardId });
      if (board.user != user.id) {
        throw new AuthenticationError(
          "You are unauthorized to access this task"
        );
      }
      return board;
    },
  },
  Mutation: {
    async createBoard(
      parent,
      { boardInput: { boardname, username } },
      context
    ) {
      const user = authenticateUser(context);
      if (user.username !== username) {
        throw new AuthenticationError(
          "You are unauthorized to create this board"
        );
      }
      if (await Board.findOne({ user: user.id, boardname: boardname })) {
        throw new UserInputError("Board already exist", {
          error: "Board Already Exists!",
        });
      }
      if (!boardname.trim()) {
        throw new UserInputError("Board can not be empty");
      }
      return await Board.create({ boardname, user: user.id });
    },
    async editBoard(
      parent,
      { boardInput: { boardname, username }, boardId },
      context
    ) {
      const user = authenticateUser(context);
      if (user.username !== username) {
        throw new AuthenticationError(
          "You are unauthorized to edit this board"
        );
      }
      if (await Board.findOne({ boardname })) {
        throw new UserInputError("Board already exist", {
          error: "Board Already Exists!",
        });
      }
      if (!boardname.trim()) {
        throw new UserInputError("Board can not be empty");
      }
      return await Board.findByIdAndUpdate(
        { _id: boardId },
        { $set: { boardname: boardname } },
        { new: true }
      );
    },
    async deleteBoard(parent, { boardId }, context) {
      const user = authenticateUser(context);
      const board = await Board.findById(boardId);
      if (user.id != board.user) {
        throw new AuthenticationError(
          "You are unauthorized to delete this board"
        );
      }
      return await Board.findByIdAndRemove({ _id: boardId });
    },
  },
};

module.exports = resolvers;
