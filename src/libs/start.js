const config = require("../config")

/*global process*/
module.exports = (app) => {
  const port = process.env.PORT || config.PORT
  app.listen(port, () => {
    console.log(
      "\x1b[33m%s\x1b[0m",
      `[Started]`,
      "\x1b[0m",
      `Check docs at http://localhost:${port}/api-docs`
    )
  })
}
