'use strict';

const ActorSystem = require('../system');

ActorSystem.register(class Renderer {
  constructor() {
    console.log('Start actor: Renderer');
  }

  message({ url, success, status }) {
    const to = 'nodeua.com@gmail.com';
    const msg = success ? 'is available again' : 'is not available';
    const date = new Date().toUTCString();
    const reason = (success ? 'Status code: ' : 'Error code: ') + status;
    const message = `Resource ${url} ${msg} (${date})\n${reason}`;
    const subject = 'Server Monitoring';
    ActorSystem.send('Mailer', { to, subject, message });
  }

  exit() {
    console.log('Stop actor: Renderer');
  }
});
