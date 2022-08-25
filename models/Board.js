const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema(
  {
    boardname: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasks: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: {
          type: String,
          enum: ["Todo", "Doing", "Done"],
          default: "Todo",
        },
        subtasks: [{ subtask: String, completed: Boolean }],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", BoardSchema);
