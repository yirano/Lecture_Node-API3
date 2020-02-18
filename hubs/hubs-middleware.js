const hubs = require("./hubs-model")

// A middleware function that ensures our request body has a "name" value
function validateHubData() {
	return (req, res, next) => {
		if (!req.body.name) {
			// if we return, function doesn't move on to "next".
			// it cancels the middleware stack and returns a response immediately
			return res.status(400).json({
				message: "Missing hub name",
			})
		}

		// everything looks good, move on to the next piece of middleware or the route handler
		next()
	}
}

// A middleware function that ensures a hub ID exists before trying to use it
function validateHubId(idParam) {
	return (req, res, next) => {
		hubs.findById(req.params.id)
			.then((hub) => {
				if (hub) {
					// attach a value to our request, so it's available
					// in other middleware functions
					req.hub = hub

					next() // move to the route handler, or next piece of middleware
				} else {
					res.status(404).json({
						message: "Hub not found",
					})
				}
			})
			.catch((error) => {
				// calling next with a parameter will move directly to the error middleware,
				// defined in our index.js at the bottom of the stack
				next(error)
			})
	}
}

module.exports = {
	validateHubData,
	validateHubId,
}