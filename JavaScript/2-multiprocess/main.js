'use strict';

const ActorSystem = require('./system.js');

const EXIT_NORMAL = 1000;
const EXIT_ABNORMAL = 5000;

ActorSystem.start('Root');

process.on('SIGINT', () => {
  console.log('');
  ActorSystem.stop('Root');
  setTimeout(() => {
    console.log('Graceful shutdown');
    process.exit(0);
  }, EXIT_NORMAL);
  setTimeout(() => {
    console.log('Abnormal termination');
    process.exit(1);
  }, EXIT_ABNORMAL);
});
