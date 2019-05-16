'use strict';

class ActorSystem {
  static register(actor) {
    ActorSystem.actor = actor;
  }

  static start(name, count = 1) {
    process.send({ command: 'start', name, count });
  }

  static stop(name) {
    process.send({ command: 'stop', name });
  }

  static send(name, data) {
    process.send({ command: 'message', name, data });
  }
}

ActorSystem.actor = null;
ActorSystem.instance = null;

process.on('SIGINT', () => {});

process.on('message', message => {
  const { command } = message;
  if (command === 'start') {
    const { name } = message;
    require(`./actors/${name.toLowerCase()}.js`);
    const ActorClass = ActorSystem.actor;
    ActorSystem.instance = new ActorClass();
    return;
  }
  if (command === 'stop') {
    const { instance } = ActorSystem;
    if (instance) instance.exit();
    process.exit(0);
    return;
  }
  if (command === 'message') {
    const { instance } = ActorSystem;
    if (instance) {
      const { data } = message;
      const { name } = ActorSystem.actor;
      instance.message(data);
      process.send({ command: 'ready', name, pid: process.pid });
    }
  }
});

module.exports = ActorSystem;
