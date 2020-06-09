const express = require("express")
const morgan = require("morgan")
const noInsomnia = require("./middleware/no-insomnia")
const logger = require("./middleware/logger")
const welcomeRouter = require("./welcome/welcome-router")
const usersRouter = require("./users/users-router")

const server = express()
const port = 4000

server.use(express.json())
// server.use(noInsomnia())
// server.use(morgan("combined"))
server.use(logger("long"))

server.use(welcomeRouter)
server.use(usersRouter)

// This is considered error middleware since it has four parameters
server.use((err, req, res, next) => {
	// log the error and send back generic message so we don't expose
	// any potentailly-sensitive information contained in the error message
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong, please try again later",
	})
})

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
