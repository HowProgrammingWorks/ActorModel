'use strict';

const ActorSystem = require('../system');
const http = require('http');

const URL = 'http://localhost:8000/';
const INTERVAL = 2000;

ActorSystem.register(class Monitoring {
  constructor() {
    console.log('Start actor: Monitoring');
    this.prevSuccess = true;
    this.timer = setInterval(() => {
      this.attempt(URL);
    }, INTERVAL);
  }

  attempt(url) {
    http.get(url, res => {
      const success = res.statusCode === 200;
      this.notify({ url, success, status: res.statusCode });
    }).on('error', error => {
      this.notify({ url, success: false, status: error.message });
    });
  }

  notify({ url, success, status }) {
    if (this.prevSuccess !== success) {
      this.prevSuccess = success;
      ActorSystem.send('Renderer', { url, success, status });
    }
  }

  message() {}

  exit() {
    clearInterval(this.timer);
    console.log('Stop actor: Monitoring');
  }
});
