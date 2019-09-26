'use strict'

// Normalize all headers to lower-case
const middleware = () => ({
  before (handler, next) {
    if (handler.event.headers) {
      Object.keys(handler.event.headers).forEach(function (key) {
        handler.event.headers[key.toLowerCase()] = handler.event.headers[key]
      })
    }
    next()
  }
})

module.exports = middleware
