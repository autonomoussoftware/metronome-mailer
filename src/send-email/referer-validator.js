'use strict'

const { validator } = require('middy/middlewares')

// Validate the `referer` header matches the provided pattern.
const middleware = pattern =>
  validator({
    inputSchema: {
      type: 'object',
      properties: {
        headers: {
          type: 'object',
          properties: {
            referer: {
              type: 'string',
              pattern
            }
          },
          required: ['referer']
        }
      },
      required: ['headers']
    }
  })

module.exports = middleware
