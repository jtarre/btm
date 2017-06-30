Bridge The Media Chrome Extension

Important files in production:


- btm-facebook.js - Responsible for BTM icon embeddings on Facebook 
- link_hover.js:
	- responsible for popover appeareance on news sites via hovering over headlines AND 
	- responsible for placing Show Alternatives button on bottom-left or bottom-right of an specific article's page

- popup.js - Google Analytics logic lives here
- List of content scripts and css files injected into facebook, nytimes, or fox is listed in manifest.json


Refactoring Effort:

- Branch: dev/master/embed-icon

The goal is to separate the logic for embedding the BTM icon/Show Alternatives button from obtaining recommendations into separate modules.

- recommendation-fetcher.js
	- should be responsible for making API requests to recommendation source
	- should be responsible for parsing and transforming results of API request
- embed-recommendations.js
	- should be responsible for all embedding logic
	- should be responsible for registering events that use recommendation-fetcher for obtaining recommendations
	- should be responsible for rendering recommendations into html that makes up the BTM popover

Testing:

- Currently using Mocha + Chai - see recommendation-fetcher-spec.js for an example 
- To run tests: mocha --reporter=nyan ./*-spec.js




