const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxb1c8906279854f14b215b7157331d718.mailgun.org';

const sendWelcomeEmail = (email, name) => {

  const mg = mailgun({apiKey: process.env.API_KEY, domain: DOMAIN});

  console.log(email)
  console.log(name)

  const data = {
    from: 'akshatgarg2002@gmail.com',
    to: email,
    subject: 'Welcome!!!',
    text: `Hello!!, ${name} Create and manage your tasks`
  };

  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
}

const sendCancelationEmail = (email, name) => {

  const mg = mailgun({apiKey: '88a07f09dc1db6f20acd27b1f1b9c15c-4c955d28-662fc318', domain: DOMAIN});

  const data = {
    from: 'akshatgarg2002@gmail.com',
    to: email,
    subject: 'Sorry to hear',
    text: `Hello!!, ${name} Please give your feedback`
  };

  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}
