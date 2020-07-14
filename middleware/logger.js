
// build out the Morgan middleware from scratch
module.exports = (format) => {
  return (req, res, next) => {
    switch (format) {
      case "short":
        console.log(`${Date.now()} ${req.method} ${req.url}`)
        break
      case "long":
      default:
        const time = new Date().toISOString()
        // log out some infor about this request
        console.log(`[${time}] ${req.ip} ${req.method} ${req.url}`)
    }
    // move on to the next piece of middleware, we are done here
    next()
  } // gives us the date and time without a timezone
}