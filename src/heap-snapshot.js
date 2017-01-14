const fs = require('fs');
const { remote } = require('webdriverio');

module.exports = function recordHeapSnapshot(url, name) {
  const browser = remote({
    desiredCapabilities: { browserName: 'chrome' }
  });

  return browser
    .init()
    .url(url)
    .execute(':takeHeapSnapshot')
    .then(({ value }) => {
      // Reassign the keys in the expected order by the devtool
      const snapshot = JSON.stringify({
        snapshot: value.snapshot,
        nodes: value.nodes,
        edges: value.edges,
        trace_function_infos: value.trace_function_infos,
        trace_tree: value.trace_tree,
        samples: value.samples,
        strings: value.strings
      });
      fs.writeFileSync(`${name}.heapsnapshot`, snapshot);
    })
    .end();
}