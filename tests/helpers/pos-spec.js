/* globals describe it */

/*

Tests for the slug extraction using npm module pos
/src/helpers/site-constants

*/

const expect = require('chai').expect
	, { getSlug } = require('../../js/helpers/site-constants');

describe('getSlug', () => {
	const exampleSlug = 'russia-hacked-america'
		, exampleExtraction = getSlug(exampleSlug);

	it('should exist and be a function', () => {
		expect(getSlug).to.exist;
		expect(typeof getSlug).to.be.equal('function')
	})

	it('should return a slug containing only nouns', () => {
		expect(exampleExtraction).to.be.a('string')
		expect(exampleExtraction).to.equal('russia-america')
	})
})
