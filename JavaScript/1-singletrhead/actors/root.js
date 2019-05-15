'use strict';

const ActorSystem = require('../system');

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
    }, 10000);
    await ActorSystem.stop('Monitoring');
    await ActorSystem.stop('Renderer');
    await ActorSystem.stop('Mailer');
    console.log('Stop actor: Root');
    console.log('Graceful shutdown');
    process.exit(0);
  }
});
