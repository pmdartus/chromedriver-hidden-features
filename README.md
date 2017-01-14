# Setup

```sh
git clone https://github.com/pmdartus/chromedriver-hidden-features
cd chromedriver-hidden-features
npm install
```

Selenium should be running and available on `localhost:4444`.

# Usage

```sh
# Usage [command] [url] [file name]

node index.js cpu-profile http://github.com res     # Takes a CPU profile of the page loading
node index.js heap-snapshot http://github.com res   # Takes a heap snapshot
node index.js timeline http://github.com res        # Record a timeline of the page loading
```