const fs = require('fs');
const { remote } = require('webdriverio');

module.exports = function recordCPUProfile(url, name) {
  const browser = remote({
    desiredCapabilities: { browserName: 'chrome' }
  });

  return browser
    .init()
    .execute(':startProfile')
    .url(url)
    .execute(':endProfile')
    .then(({ value }) => {
      const snapshot = JSON.stringify(value.profile);
      fs.writeFileSync(`${name}.cpuprofile`, snapshot);
    })
    .end()
}