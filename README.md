# Metronome Mailer

[![Build Status](https://travis-ci.com/autonomoussoftware/metronome-send-email.svg?branch=master)](https://travis-ci.com/autonomoussoftware/metronome-send-email)

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

## Deployment

To deploy the components to AWS, run:

```shell
npm run deploy:staging
```

The deployment defaults to region `us-east-1`.
To overwrite, append `-- --region <region>` to the above command.

You need to be have an AWS user with enough privileges to create the API Gatway, Lambda function, roles, etc.

### Troubleshooting

To debug the Lambda function execution, set the environment variable `DEBUG` to `met*` in the function configuration.
Additional events will be logged to CloudWatch.

If you get any `CloudFormation - CREATE_FAILED` error during deploy, most likely the AWS user used lacks the required permissions.

If the emails are not sent with `Email address is not verified`, go to the SES configuration and verify the email address defined in `FROM_ADDRESS`.

## Setting up a custom domain in AWS

Follow these steps in the same region the service was deployed to.

- In the Certificate Manager request a public certificate for the domain to be used. DNS validation is recommended.
- In the API Gateway go to Custom Domain Names and create a custom domain name. Select the above created certificate and map the base path ("/") to the proper function and environment.
- In Route 53, add a domain alias record (A) to the target domain name created above.

## License

MIT
