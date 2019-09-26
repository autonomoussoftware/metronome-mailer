'use strict'

const debug = require('debug')('metronome-mailer:send-email:handler')
const validator = require('validator')

/**
 * Creates the email body based on the submitted form data.
 *
 * @typedef EmailFormData
 * @property {string} comment
 * @property {string} email
 * @property {string} location
 * @property {string} name
 * @property {string} url
 *
 * @param {EmailFormData} form The form data.
 * @returns {string} The email body.
 */
function createEmailBody (form) {
  return `Someone wants to connect!

Name: ${validator.escape(form.name)}
Email: ${validator.normalizeEmail(form.email)}
Location: ${validator.escape(form.location)}
Event/Meet Up Link: ${validator.stripLow(form.url)}

Comment:
${validator.escape(form.comment)}`
}

/**
 * Create a function to send an email using SES.
 *
 * @typedef EmailMessage
 * @property {string} from
 * @property {string[]} to
 * @property {string} subject
 * @property {string} text
 *
 * @typedef AWSSESLike
 * @property {(params:object)=>{promise:()=>Promise<AWS.SES.SendEmailResponse>}} sendEmail
 *
 * @param {AWSSESLike} ses The SES object instance.
 * @returns {(message:EmailMessage)=>Promise<AWS.SES.SendEmailResponse>} The email sender function.
 */
function createSendEmail (ses) {
  return function ({ from, to, subject, text }) {
    const params = {
      Source: from,
      Destination: { ToAddresses: to },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: text } }
      }
    }
    return ses.sendEmail(params).promise()
  }
}

/**
 * Create the envent handler to send the email using SES.
 *
 * @typedef SendEmailOptions
 * @property {string} fromAddress
 * @property {string[]} toAddresses
 * @property {string} redirectUrl
 *
 * @typedef HandlerResponse
 * @property {number} statusCode
 * @property {string} [body]
 * @property {object} [headers]
 *
 * @param {AWSSESLike} ses The SES object instance.
 * @param {SendEmailOptions} options The email configuration options.
 * @returns {(event:{body:object})=>Promise<HandlerResponse>} The email sender handler.
 */
function createHandler (ses, options) {
  const { fromAddress, toAddresses, redirectUrl } = options
  const sendEmail = createSendEmail(ses)

  return function (event) {
    debug('Sending email')
    return sendEmail({
      from: fromAddress,
      to: toAddresses,
      subject: 'New form submission from metronome.io!',
      text: createEmailBody(event.body)
    })
      .then(function ({ MessageId }) {
        debug('Email sent: %s', MessageId)
      })
      .catch(function (err) {
        // Don't tell the user we could not send the email. Just log the issue.
        debug('Email could not be sent: %s', err.message)
      })
      .then(() => ({
        statusCode: 303,
        headers: { Location: redirectUrl }
      }))
  }
}

module.exports = createHandler
