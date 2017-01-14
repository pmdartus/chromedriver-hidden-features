const fs = require('fs');
const { remote } = require('webdriverio');

// Those categories can be found in the chrome://tracing/ page.
// From https://github.com/GoogleChrome/lighthouse/blob/96173a2302b9abc5153f1b43776fb851c10fbe76/lighthouse-core/gather/driver.js#L44
const TRACE_CATS = [
  '-*', // exclude default
  'toplevel',
  'blink.console',
  'blink.user_timing',
  'benchmark',
  'latencyInfo',
  'devtools.timeline',
  'disabled-by-default-devtools.timeline',
  'disabled-by-default-devtools.timeline.frame',
  'disabled-by-default-devtools.timeline.stack',
  'disabled-by-default-v8.cpu_profiler',
  'disabled-by-default-v8.cpu_profiler.hires',
  'disabled-by-default-devtools.screenshot'
];

/*
Extract the trace events from the browser log. Example:
{ 
  "level": "INFO", 
  "message": "{\"message\":{\"method\":<LOG TYPE>,\"params\":<TRACE EVENT>}", 
  "timestamp": 1484405568354 
}
*/
function logToTimeline(logs) {
  return logs
    .map(rawLog => JSON.parse(rawLog.message).message)
    // We only keep data collected and remove the tracing started events in order
    // to be able to load the tracing in the devtool (started event are log twice sometime).
    .filter(logEntry => (
      logEntry.method === 'Tracing.dataCollected' && 
      logEntry.params.name !== 'TracingStartedInBrowser'
    ))
    .map(logEntry => logEntry.params);
}

module.exports = function recordTimeline(url, name) {
  const client = remote({
    desiredCapabilities: {
      browserName: 'chrome',
      chromeOptions: {
        perfLoggingPrefs: { traceCategories: TRACE_CATS.join(',') }
      },

      loggingPrefs: {
        performance: 'ALL',
      },
    },
  });

  return client
    .init()
    .log('performance')
    .url(url)
    .log('performance')
    .then(({ value }) => {
      const timeline = JSON.stringify(logToTimeline(value));
      fs.writeFileSync(`${name}.json`, timeline);
    })
    .end()
}