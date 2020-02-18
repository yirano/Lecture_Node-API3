const express = require("express")
const hubs = require("./hubs-model")
const { validateHubData, validateHubId } = require("./hubs-middleware")

const router = express.Router()

// This handles the route /api/hubs
// We no longer have to define the route prefix,
// since it's defined when attaching to the main router in `index.js`
router.get("/", (req, res, next) => {
	// query strings allow us to pass generic key/values not specific to the resource.
	// they are part of the URL, everything after the question mark (?).
	// e.g. /api/hubs?sortBy=name&limit=5
	const opts ={
		sortBy: req.query.sortBy,
		limit: req.query.limit,
	}

	hubs.find(opts)
		.then((hubs) => {
			res.status(200).json(hubs)
		})
		.catch((error) => {
			// calling "next" with no parameters moves to the next piece of middleware,
			// calling "next" with a parameter moves to the error middleware.
			next(error)
		})
})

// This handles the route /api/hubs/:id
router.get("/:id", validateHubId(), (req, res, next) => {
	// "req.hub" comes from the "validateHubId" middleware
	res.status(200).json(req.hub)
})

// This handles POST /api/hubs
router.post("/", validateHubData(), (req, res, next) => {
	hubs.add(req.body)
		.then((hub) => {
			res.status(201).json(hub)
		})
		// can shorten our catch statements even more
		.catch(next)
})

// This handles PUT /api/hubs/:id
router.put("/:id", validateHubData(), validateHubId(), (req, res, next) => {
	hubs.update(req.params.id, req.body)
		.then((hub) => {
			if (hub) {
				res.status(200).json(hub)
			} else {
				res.status(404).json({
					message: "The hub could not be found",
				})
			}
		})
		.catch((error) => {
			next(error)
		})
})

// This handles DELETE /api/hubs/:id
router.delete("/:id", validateHubId(), (req, res, next) => {
	hubs.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The hub has been nuked",
				})
			} else {
				res.status(404).json({
					message: "The hub could not be found",
				})
			}
		})
		.catch((error) => {
			next(error)
		})
})

// This handles GET /api/hubs/:id/messages
router.get("/:id/messages", validateHubId(), (req, res, next) => {
	hubs.findHubMessages(req.params.id)
		.then((messages) => {
			res.status(200).json(messages)
			// or just res.json(messages) since express defaults to a 200
		})
		.catch((error) => {
			next(error)
		})
})

// This handles GET /api/hubs/:id/messages/:messageID
router.get("/:id/messages/:messageId", validateHubId(), (req, res, next) => {
	hubs.findHubMessageById(req.params.id, req.params.messageId)
		.then((message) => {
			if (message) {
				res.json(message)
			} else {
				res.status(404).json({
					message: "Message was not found",
				})
			}
		})
		.catch((error) => {
			next(error)
		})
})

// This handles POST /api/hubs/:id/messages
router.post("/:id/messages", validateHubId(), (req, res, next) => {
	const { sender, text } = req.body
	if (!sender || !text) {
		// the easiest way to end a request early if we know something is wrong,
		// is to just return. Javascript doesn't run anything in the function after returning.
		return res.status(400).json({
			message: "Need sender and text values",
		})
	}

	hubs.addHubMessage(req.params.id, req.body)
		.then((newMessage) => {
			res.status(201).json(newMessage)
		})
		.catch((error) => {
			next(error)
		})
})

module.exports = router