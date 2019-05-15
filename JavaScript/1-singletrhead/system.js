'use strict';

const actors = new Map();

class ActorSystem {
  static register(actor) {
    const instances = [];
    const next = 0;
    actors.set(actor.name, { actor, instances, next });
  }

  static start(name, count = 1) {
    require(`./actors/${name.toLowerCase()}.js`);
    const record = actors.get(name);
    if (record) {
      const ActorClass = record.actor;
      const { instances } = record;
      for (let i = 0; i < count; i++) {
        const instance = new ActorClass();
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

  static send(name, data) {
    const record = actors.get(name);
    if (record) {
      const { instances, next } = record;
      const actor = instances[next];
      if (instances.length - 1 > next) record.next++;
      else record.next = 0;
      actor.message(data);
    }
  }
}

module.exports = ActorSystem;
