'use strict';

const actors = new Map();

class ActorSystem {
  static register(actor) {
    const ready = [];
    const instances = [];
    const queue = [];
    actors.set(actor.name, { actor, ready, instances, queue });
  }

  static start(name, count = 1) {
    require(`./actors/${name.toLowerCase()}.js`);
    const record = actors.get(name);
    if (record) {
      const ActorClass = record.actor;
      const { ready, instances } = record;
      for (let i = 0; i < count; i++) {
        const instance = new ActorClass();
        ready.push(instance);
        instances.push(instance);
      }
    }
  }

  static async stop(name) {
    const record = actors.get(name);
    if (record) {
      const { instances } = record;
      await Promise.all(instances.map(instance => instance.exit()));
    }
  }

  static async send(name, data) {
    const record = actors.get(name);
    if (record) {
      const { ready, queue } = record;
      const actor = ready.shift();
      if (!actor) {
        queue.push(data);
        return;
      }
      await actor.message(data);
      ready.push(actor);
      if (queue.length > 0) {
        const next = queue.shift();
        this.send(name, next);
      }
    }
  }
}

module.exports = ActorSystem;
