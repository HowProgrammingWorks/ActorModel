'use strict';

const threads = require('node:worker_threads');
const { isMainThread } = threads;

module.exports = isMainThread ? require('./master') : require('./worker');
