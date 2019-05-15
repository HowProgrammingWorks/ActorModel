'use strict';

module.exports = process.channel ? require('./worker') : require('./master');
