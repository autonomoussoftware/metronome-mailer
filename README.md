# Metronome Email Sender

[![Build Status](https://travis-ci.com/bloq/metronome-send-email.svg?branch=master)](https://travis-ci.com/bloq/metronome-send-email)

This is a "serverless" service to support the contact form in the Engage page of the site.

The service's target is AWS.
It has an API Gateway that exposes an HTTP route to receive the contact form data, forwards it to a Lambda function that ends up calling SES to send an email to the Metronome staff.
Look ma no servers!

## Development

Spin up the services:

```shell
npm run dev
```

Then post form data to `http://localhost:3000/contact-met`.

On success, it will store the email sent in the `output` folder and will redirect the caller to the `thank-you` page address.

## Configuration options

These environment variables control the behavior of the service:

- `REDIRECT_PATH`: The path of the `thank-you` page.
- `FROM_ADDRESS`: The "from" address of the email.
- `TO_ADDRESSES`: The recipients of the email as a comma-sepparated list of addresses.

## License

MIT
