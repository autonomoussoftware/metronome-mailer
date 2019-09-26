'use strict'

const { validator } = require('middy/middlewares')

// Validate the event body matches the provided schema.
const middlewares = schema =>
  validator({
    inputSchema: {
      type: 'object',
      properties: {
        body: schema
      },
      required: ['body']
    }
  })

module.exports = middlewares
