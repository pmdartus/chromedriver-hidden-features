const fs = require('fs');
const { remote } = require('webdriverio');

function takeHeapSnapshot(url, name) {
  return remote()
    .init()
    .url(url)
    .execute(':takeHeapSnapshot')
    .then(({ value }) => {
      const snapshot = JSON.stringify(value);
      fs.writeFileSync(`${name}.heapsnapshot`, snapshot);
    })
    .end()
}

if (process.argv.length < 4) {
  throw new Error('Usage: node ./heap-snapshot [url] [snapshot-name]');
}

const [url, name]  = process.argv.slice(-2);
takeHeapSnapshot(url, name)
  .catch(console.error)