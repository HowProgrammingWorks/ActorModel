'use strict';

const ActorSystem = require('../system');

const EXIT_TIMEOUT = 10000;

ActorSystem.register(class Root {
  constructor() {
    console.log('Start actor: Root');
    ActorSystem.start('Monitoring');
    ActorSystem.start('Renderer');
    ActorSystem.start('Mailer', 3);
  }

  async message() {}

  async exit() {
    setTimeout(() => {
      console.log('Abnormal termination');
      process.exit(1);
    }, EXIT_TIMEOUT);
    await ActorSystem.stop('Monitoring');
    await ActorSystem.stop('Renderer');
    await ActorSystem.stop('Mailer');
    console.log('Stop actor: Root');
    console.log('Graceful shutdown');
    process.exit(0);
  }
});
