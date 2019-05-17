'use strict';

const ActorSystem = require('../system');
const nodemailer = require('nodemailer');
const auth = require('../config');

const FROM = 'nodeua.com@gmail.com';

ActorSystem.register(class Mailer {
  constructor() {
    console.log('Start actor: Mailer');
    this.transport = nodemailer.createTransport({
      service: 'gmail', auth
    });
  }

  message({ to, subject, message }) {
    const mail = { from: FROM, to, subject, text: message };
    this.transport.sendMail(mail, (error, data) => {
      if (error) console.log(error);
      else console.log(`Email sent: ${data.response}`);
    });
  }

  exit() {
    this.transport.close();
    console.log('Stop actor: Mailer');
  }
});
