const fs = require('fs');
const { remote } = require('webdriverio');

function takeCPUProfile(url, name) {
  return remote()
    .init()
    .execute(':startProfile')
    .url(url)
    .execute(':endProfile')
    .then(({ value }) => {
      const snapshot = JSON.stringify(value);
      fs.writeFileSync(`${name}.cpuprofile`, snapshot);
    })
    .end()
}

if (process.argv.length < 4) {
  throw new Error('Usage: node ./heap-snapshot [url] [snapshot-name]');
}

const [url, name]  = process.argv.slice(-2);
takeCPUProfile(url, name)
  .catch(console.error)