# Bridge The Media

A nonpartisan tool for the well-rounded news reader.

Our Google Chrome Extension encourages citizens to be more informed participants in American democracy through balanced media. Let us recommend articles to complete your political perspective.

Current [production version](https://chrome.google.com/webstore/detail/bridge-the-media/cbjilbjbnknaboggkkdficoholohdcco): v.2.0.7

Dev version: 2.0.9

- BTM popover redesign
  - Headers standardized
- Expansion to more news publications
  - /us/ and /world/ added

## Important files in production

- btm.js - Responsible for placing BTM icons and Show Alternatives Button
- popup.js - Google Analytics logic lives here
- manifest.json - Entry point for Chrome; list of content scripts and css injections

## Development

1. ```npm install``` to install new dependencies
2. ```npm run build-watch``` to automatically regenerate a `bundle.js` with code changes


## Deployment

1. ```npm run build``` to generate a `bundle.js`
2. Make sure the ```manifest.json``` points to the ```bundle.js```
3. Upload the ```/src``` subdirectory as the extension's package


## Testing

- Currently using Mocha + Chai - see recommendation-fetcher-spec.js for an example
- To run all tests: ```npm test```
- To run a specific suite: ```mocha <example.spec.js>```

## Linting

- BTM uses ESlint with a modified Airbnb style guide
- To lint against a file: ```./node_modules/.bin/eslint <yourfile.js>```
- To lint against whole project: ```npm run linter```

## Contributing Guidelines

1. There are two main branches: btm-stable (production) and master (dev)
2. For a bug fix, branch off of btm-stable, merge into btm-stable, then merge btm-stable into master
3. For new features, branch off of master and merge into master
4. New code on master will be merged into btm-stable, and btm-stable will be deployed.
