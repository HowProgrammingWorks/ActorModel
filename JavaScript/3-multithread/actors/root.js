'use strict';

const ActorSystem = require('../system');

ActorSystem.register(class Root {
  constructor() {
    console.log('Start actor: Root');
    ActorSystem.start('Monitoring');
    ActorSystem.start('Renderer');
    ActorSystem.start('Mailer', 3);
  }

  message() {}

  exit() {
    ActorSystem.stop('Monitoring');
    ActorSystem.stop('Renderer');
    ActorSystem.stop('Mailer');
    console.log('Stop actor: Root');
  }
});
