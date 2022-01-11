require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const auth = require('./middleware/authentication')
// connect db
const connectDb = require('./db/connect')
// routers

const authRouter = require('./routes/auth')
const tasksRouter = require('./routes/task')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const res = require('express/lib/response')

app.use(express.static('./static', { extensions: ['html', 'htm'] }))
app.use(express.json())
// extra packages

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/tasks', auth, tasksRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 8080

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    )
  } catch (error) {
    console.log(error)
  }
}

start()
