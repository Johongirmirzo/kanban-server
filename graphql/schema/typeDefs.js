const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    token: String
  }
  type Board {
    id: ID!
    boardname: String!
    tasks: [Task]!
    user: User!
  }
  type Task {
    id: ID!
    title: String!
    description: String!
    status: TaskStatus!
    subtasks: [SubTask]!
  }
  type SubTask {
    id: ID!
    subtask: String!
    completed: Boolean!
  }
  enum TaskStatus {
    Todo
    Doing
    Done
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  input BoardInput {
    boardname: String!
    username: String!
  }
  input SubTaskInput {
    id: ID!
    subtask: String!
    completed: Boolean!
  }

  input TaskInput {
    title: String!
    description: String!
    status: TaskStatus = Todo
    subtasks: [SubTaskInput]
  }

  type Query {
    boards: [Board]!
    board(boardId: ID!): Board!
  }

  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(email: String!, password: String!): User!

    createBoard(boardInput: BoardInput!): Board!
    editBoard(boardInput: BoardInput!, boardId: ID!): Board!
    deleteBoard(boardId: ID!): Board!

    createTask(taskInput: TaskInput!, boardId: ID!): Task!
    editTask(taskInput: TaskInput!, boardId: ID!, taskId: ID!): Task!
    deleteTask(boardId: ID!, taskId: ID!): ID!

    changeTaskStatus(boardId: ID!, taskId: ID, taskStatus: String!): Task!
    toggleSubTask(boardId: ID!, taskId: ID!, subtaskId: ID!): Task!
  }
`;

module.exports = typeDefs;
