const express = require('express')

const {
  getAllTasks,
  getTasks,
  deleteTasks,
  createTasks,
  updateTasks,
} = require('../controllers/task')

const router = express.Router()

router.route('/').get(getAllTasks).post(createTasks)
router.route('/:id').get(getTasks).delete(deleteTasks).patch(updateTasks)
module.exports = router
