module.exports = () => {
	return (req, res, next) => {
		// a string that tells us what software the client is using
		const agent = req.headers["user-agent"]

		if (/insomnia/i.test(agent)) {
			return res.status(418).json({
				message: "No Insomnia allowed here",
			})
		}

		next()
	}
}
