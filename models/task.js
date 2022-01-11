const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide the task name'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'please provide a user'],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Task', TaskSchema)
