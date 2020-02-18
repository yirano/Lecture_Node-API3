const express = require("express")
// const morgan = require("morgan")
const helmet = require("helmet")
const logger = require("./middleware/logger")
const welcomeRouter = require("./welcome/welcome-router")
const hubsRouter = require("./hubs/hubs-router")

const server = express()
const port = 4000

server.use(logger("short"))
// server.use(morgan("short"))
server.use(helmet())
server.use(express.json())
// these are not sub-routers, that get attached to the main application.
// helps us keep our endpoints organized in many different files.
server.use("/", welcomeRouter)
server.use("/api/hubs", hubsRouter)

// this middleware runs if no route is found, since middleware runs in order
server.use((req, res) => {
	res.status(404).json({
		message: "Route was not found",
	})
})

// this is our error middleware, that "catches" errors in other middleware
// when the call "next" with a parameter. Like `next(error)`
server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		// keep server errors generic, we don't want to expose details of potential bugs
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})