'use strict';

const actors = new Map();

class ActorSystem {
  static register(actor) {
    const instances = [];
    const next = 0;
    actors.set(actor.name, { actor, instances, next });
  }

  static start(name) {
    require('./actors/' + name.toLowerCase() + '.js');
    const record = actors.get(name);
    if (record) {
      const ActorClass = record.actor;
      const { instances } = record;
      const instance = new ActorClass();
      instances.push(instance);
    }
  }

  static async stop(name) {
    const record = actors.get(name);
    if (record) {
      const { instances } = record;
      await Promise.all(instances.map(instance => instance.exit()));
    }
  }

  static send(name, data) {
    const record = actors.get(name);
    if (record) {
      const { instances } = record;
      instances[0].message(data);
    }
  }
}

module.exports = ActorSystem;
