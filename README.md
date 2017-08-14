# Bridge The Media

A nonpartisan tool for the well-rounded news reader.

Our Google Chrome Extension encourages citizens to be more informed participants in American democracy through balanced media. Let us recommend articles to complete your political perspective.

Current [production version](https://chrome.google.com/webstore/detail/bridge-the-media/cbjilbjbnknaboggkkdficoholohdcco): v.1.7

Dev version: v.2.0.5
- Webpack integration
- Key tucked into searcher const
- Embedded icons
- Google Search API slug only includes nouns
- Bugs addressed for v.2 release

## Important files in production

- btm-facebook.js - Responsible for BTM icon embeddings on Facebook
- btm-embed-icon.js:
	- responsible for placing BTM icons on news page sites next to political/opinion headlines
- btm-article-page.js:
	- responsible for placing Show Alternatives button on bottom-left or bottom-right of an specific article's page
- popup.js - Google Analytics logic lives here
- List of content scripts and css files injected into facebook, nytimes, or fox is listed in manifest.json

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

- BTM uses ESlint with Airbnb style guide
- To lint against a file: ```./node_modules/.bin/eslint <yourfile.js>```

## Contributing Guidelines

1. There are two main branches: btm-stable (production) and master (dev)
2. For a bug fix, branch off of btm-stable, merge into btm-stable, then merge btm-stable into master
3. For new features, branch off of master and merge into master
4. New code on master will be merged into btm-stable, and btm-stable will be deployed.
