'use strict';

const threads = require('worker_threads');
const { isMainThread } = threads;

module.exports = isMainThread ? require('./master') : require('./worker');
