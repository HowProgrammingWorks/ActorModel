'use strict';

const threads = require('worker_threads');
const master = threads.parentPort;

class ActorSystem {
  static register(actor) {
    ActorSystem.actor = actor;
  }

  static start(name, count = 1) {
    master.postMessage({ command: 'start', name, count });
  }

  static stop(name) {
    master.postMessage({ command: 'stop', name });
  }

  static send(name, data) {
    master.postMessage({ command: 'message', name, data });
  }
}

ActorSystem.actor = null;
ActorSystem.instance = null;

//process.on('SIGINT', () => {});

master.on('message', message => {
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
      const msg = { command: 'ready', name, id: threads.threadId };
      master.postMessage(msg);
    }
  }
});

module.exports = ActorSystem;
