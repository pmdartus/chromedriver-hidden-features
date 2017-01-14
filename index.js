'use strict';

const cpuProfile = require('./src/cpu-profile');
const heapSnapshot = require('./src/heap-snapshot');
const timeline = require('./src/timeline');

if (process.argv.length !== 5) {
  console.error(`Usage: ./${__filename} [url] [filename]`);
  process.exit(1);
}

const [command, url, name]  = process.argv.slice(-3);

let method = null;
switch (command) {
  case 'cpu-profile':
    method = cpuProfile;
    break;

  case 'heap-snapshot':
    method = heapSnapshot;
    break;

  case 'timeline':
    method = timeline;
    break;

  default:
    console.error(`Unknown command ${command}`);
    process.exit(1);
}

method(url, name).then(
  () => console.log('DONE'),
  err => console.error(err)
);