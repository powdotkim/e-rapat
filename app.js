require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const app = express()
const cors = require('cors')
const port = process.env.PORT
const userRouter = require('./routes/UserRoute')
const meetingRoute = require('./routes/MeetingRoute')
const participantRoute = require('./routes/ParticipantRoute')
const categoryRoute = require('./routes/CategoryRoute')
const authRoute = require('./routes/AuthRoute')
const https = require(`https`)
const fs = require(`fs`)

require('./database/connection')

const credentials = {
    pfx: fs.readFileSync(process.env.pfx),
    passphrase: process.env.passphrase,
    ca: fs.readFileSync(process.env.ca),
}

const server = https.createServer(credentials, app)

app.use(cors())

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(bodyParser.json())

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (req, res) => {
    res.json({ message: 'ok' })
})

app.use('/users', userRouter)
app.use('/meetings', meetingRoute)
app.use('/participants', participantRoute)
app.use('/categories', categoryRoute)
app.use('/auth', authRoute)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    console.error(err.message, err.stack)
    res.status(statusCode).json({ message: err.message })

    return
})

app.listen(port, '0.0.0.0', () => {
    console.log(
        chalk.green(`E-Rapat app listening at http://localhost:${port}`)
    )
})