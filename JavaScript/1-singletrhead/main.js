'use strict';

const ActorSystem = require('./system.js');

ActorSystem.start('Root');

process.on('SIGINT', () => {
  console.log();
  ActorSystem.stop('Root');
});
