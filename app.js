require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const auth = require('./middleware/authentication')
// security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
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

app.set('trust proxy', 1)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  }),
)
app.use(express.json())
// extra packages
app.use(helmet())
app.use(cors())
app.use(xss())

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
