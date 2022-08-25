const { gql, UserInputError, AuthenticationError } = require("apollo-server");
const User = require("../../models/User");
const Board = require("../../models/Board");
const authenticateUser = require("../../utils/userAuthenticate");
const { taskValidator } = require("../../utils/validator");

const resolvers = {
  Mutation: {
    async createTask(
      parent,
      {
        taskInput: { title, description, subtasks = [], status = "Todo" },
        boardId,
      },
      context
    ) {
      const user = authenticateUser(context);
      const { isValid, errors } = taskValidator(title, description);

      console.log({ title, description, status, subtasks });
      if (!isValid) {
        throw new UserInputError("Errors", { errors });
      }
      const board = await Board.findById(boardId);
      if (board.user != user.id) {
        throw new AuthenticationError(
          "You are unauthorized to create this task"
        );
      }

      board.tasks.push({ title, description, subtasks, status });
      await board.save();
      return board.tasks[board.tasks.length - 1];
      // return newly added task
    },
    async editTask(
      parent,
      {
        taskInput: { title, description, status, subtasks = [] },
        boardId,
        taskId,
      },
      context
    ) {
      const user = authenticateUser(context);
      const { isValid, errors } = taskValidator(title, description);
      console.log(subtasks, "Server Edit Task");
      if (!isValid) {
        throw new UserInputError("Errors", { errors });
      }
      const board = await Board.findById(boardId);
      if (board.user != user.id) {
        throw new AuthenticationError("You are unauthorized to edit this task");
      }
      board.tasks.forEach((task) => {
        if (task._id == taskId) {
          task.title = title || task.title;
          task.description = description || task.description;
          task.subtasks = subtasks || task.subtasks;
          task.status = status || task.status;
          console.log(subtasks, task.subtasks);
        }
      });
      await board.save();
      return board.tasks.find((task) => task._id == taskId);
    },
    async deleteTask(parent, { boardId, taskId }, context) {
      const user = authenticateUser(context);
      const board = await Board.findById(boardId);
      if (user.id != board.user) {
        throw new AuthenticationError(
          "You are unauthorized to delete this task"
        );
      }
      const taskIndex = board.tasks.findIndex((task) => task._id == taskId);
      if (taskIndex >= 0) {
        board.tasks.splice(taskIndex, 1);
        await board.save();
        return taskId;
      }
    },

    async changeTaskStatus(parent, { boardId, taskId, taskStatus }, context) {
      const user = authenticateUser(context);
      const board = await Board.findById(boardId);

      if (user.id != board.user) {
        throw new AuthenticationError(
          "You are unauthorized to change task status"
        );
      }
      console.log(taskStatus);
      board.tasks.forEach((task) => {
        if (task._id == taskId) {
          console.log(task);
          task.status = taskStatus;
        }
      });
      await board.save();
      return board.tasks.find((task) => task.id === taskId);
    },
    async toggleSubTask(parent, { boardId, taskId, subtaskId }, context) {
      const user = authenticateUser(context);
      const board = await Board.findById(boardId);
      if (user.id != board.user) {
        throw new AuthenticationError(
          "You are unauthorized to change sub-task"
        );
      }
      board.tasks.forEach((task) => {
        if (task.id === taskId) {
          task.subtasks.forEach((subtask) => {
            if (subtask.id === subtaskId) {
              // console.log(task.id, subtask.id);
              subtask.completed = !subtask.completed;
            }
          });
        }
      });

      await board.save();

      return board.tasks.find((task) => task.id === taskId);
    },
  },
};

module.exports = resolvers;
