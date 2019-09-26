'use strict'

const {
  httpErrorHandler,
  // @ts-ignore 2339 - The type definitions are incorrect
  httpMultipartBodyParser
} = require('middy/middlewares')
const AWS = require('aws-sdk')
const middy = require('middy')

const bodyValidator = require('./body-validator')
const createHandler = require('./handler')
const httpHeaderNormalizer = require('./headers-normalizer')
const refererValidator = require('./referer-validator')

const {
  ALLOWED_REFERER,
  FROM_ADDRESS,
  TO_ADDRESSES,
  REDIRECT_PATH,
  SES_ENDPOINT
} = process.env

// Create SES object instance
const sesOptions = {}
if (SES_ENDPOINT) {
  sesOptions.endpoint = SES_ENDPOINT
}
const ses = new AWS.SES(sesOptions)

// Create the event handler
const emailOptions = {
  fromAddress: FROM_ADDRESS,
  toAddresses: TO_ADDRESSES.split(','),
  redirectUrl: `${ALLOWED_REFERER}${REDIRECT_PATH}`
}
const handler = createHandler(ses, emailOptions)

module.exports.handler = middy(handler)
  .use(httpHeaderNormalizer())
  .use(httpMultipartBodyParser())
  .use(refererValidator(`^${ALLOWED_REFERER}`))
  .use(bodyValidator({ type: 'object' }))
  .use(httpErrorHandler())
