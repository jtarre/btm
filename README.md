# Bridge The Media

A nonpartisan tool for the well-rounded news reader.

Our Google Chrome Extension encourages citizens to be more informed participants in American democracy through balanced media. Let us recommend articles to complete your political perspective.

Current [production version](https://chrome.google.com/webstore/detail/bridge-the-media/cbjilbjbnknaboggkkdficoholohdcco): v.1.7

Dev version: v.2.0
- Webpack integration
- Key tucked into searcher const
- Embedded icons
- Google Search API only includes nouns

## Important files in production

- btm-facebook.js - Responsible for BTM icon embeddings on Facebook
- btm-embed-icon.js:
	- responsible for placing BTM icons on news page sites next to political/opinion headlines
- btm-article-page.js:
	- responsible for placing Show Alternatives button on bottom-left or bottom-right of an specific article's page
- popup.js - Google Analytics logic lives here
- List of content scripts and css files injected into facebook, nytimes, or fox is listed in manifest.json

## Refactoring Effort

- Branch: dev/master/embed-icon

The goal is to separate the logic for embedding the BTM icon/Show Alternatives button from obtaining recommendations into separate modules.

- recommendation-fetcher.js
	- should be responsible for making API requests to recommendation source
	- should be responsible for parsing and transforming results of API request
- embed-recommendations.js
	- should be responsible for all embedding logic
	- should be responsible for registering events that use recommendation-fetcher for obtaining recommendations
	- should be responsible for rendering recommendations into html that makes up the BTM popover


## Deployment

1. ```npm run build``` to generate a `bundle.js`
2. Make sure the ```manifest.json``` points to the ```bundle.js```
3. Upload the ```/src``` subdirectory as the extension's package


## Testing

- Currently using Mocha + Chai - see recommendation-fetcher-spec.js for an example
- To run tests: ```npm test```
