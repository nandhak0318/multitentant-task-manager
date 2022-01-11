const res = require('express/lib/response')
const mongoose = require('mongoose')
const Task = require('../models/task')
const { BadRequestError, NotFoundError } = require('../errors')

const getTasks = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: taskID },
  } = req
  if (!mongoose.Types.ObjectId.isValid(taskID)) {
    throw new BadRequestError(`no task found with id ${taskID}`)
  }
  const task = await Task.findOne({ _id: taskID, createdBy: userId })
  if (!task) {
    throw new BadRequestError(`no task found with id ${taskID}`)
  }

  res.status(200).json({ task })
}

const getAllTasks = async (req, res) => {
  const {
    user: { userId },
  } = req
  const tasks = await Task.find({ createdBy: userId })
  res.status(200).json({ tasks })
}

const deleteTasks = async (req, res, next) => {
  const {
    params: { id: taskID },
    user: { userId },
  } = req
  if (!mongoose.Types.ObjectId.isValid(taskID)) {
    throw new BadRequestError(`no task found with id ${taskID}`)
  }
  const tasks = await Task.findByIdAndDelete({ _id: taskID, createdBy: userId })
  if (!tasks) {
    throw new BadRequestError(`no task found with id ${taskID}`)
  }

  res.status(200).json({ tasks })
}

const createTasks = async (req, res, next) => {
  const createdBy = req.user.userId
  const { name, completed } = req.body
  if (!name || name == '') {
    throw new BadRequestError('please provide task name')
  }
  const tasks = await Task.create({
    name: name,
    completed: completed,
    createdBy: createdBy,
  })
  res.status(200).json({ tasks })
}

const updateTasks = async (req, res, next) => {
  const {
    params: { id: taskID },
    user: { userId },
  } = req
  const { name, completed } = req.body
  if (name == '') {
    throw new BadRequestError('name cannot be empty')
  }
  const task = await Task.findOneAndUpdate(
    { _id: taskID, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )

  if (!task) {
    throw new BadRequestError(`no task found with id ${taskID}`)
  }

  res.status(200).json({ task })
}

module.exports = {
  getAllTasks,
  getTasks,
  deleteTasks,
  createTasks,
  updateTasks,
}
