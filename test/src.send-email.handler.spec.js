'use strict'

const chai = require('chai')

const createHandler = require('../src/send-email/handler')

chai.should()

const fromAddress = 'from@metronome.io'
const toAddresses = ['to@metronome.io']
const redirectUrl = 'http://metronome.io/thank-you'

describe('Send email handler', function () {
  it('should send an email and redirect', function () {
    const name = 'Some Guy'
    const email = 'someguy@server.com'
    const sesMock = {
      sendEmail (params) {
        params.should.have.property('Source').to.equal(fromAddress)
        params.should.have.nested
          .property('Destination.ToAddresses')
          .to.equal(toAddresses)
        params.should.have.nested
          .property('Message.Body.Text.Data')
          .to.have.string(name)
          .to.have.string(email)
        return {
          promise: () => Promise.resolve({ MessageId: 'sent-id' })
        }
      }
    }
    const options = { fromAddress, toAddresses, redirectUrl }
    const handler = createHandler(sesMock, options)
    const event = {
      body: { comment: '', email, location: '', name, url: '' }
    }
    return handler(event).then(function (response) {
      response.should.deep.equal({
        headers: { Location: redirectUrl },
        statusCode: 303
      })
    })
  })

  it('should redirect even on failure', function () {
    const sesMock = {
      sendEmail: () => ({
        promise: () => Promise.reject(new Error('Send failure'))
      })
    }
    const options = { fromAddress, toAddresses, redirectUrl }
    const handler = createHandler(sesMock, options)
    const event = {
      body: { comment: '', email: '', location: '', name: '', url: '' }
    }
    return handler(event).then(function (response) {
      response.should.deep.equal({
        headers: { Location: redirectUrl },
        statusCode: 303
      })
    })
  })
})
