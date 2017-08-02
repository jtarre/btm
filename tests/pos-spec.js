/* globals describe it */

/*

Tests for the slug extraction using npm module pos
/src/helpers/site-constants

*/

const expect = require('chai').expect
  , { getSlug } = require('../src/helpers/site-constants');

describe('getSlug', () => {

  const exampleSlug = 'russia-hacked-america'

  it('should exist and be a function', () => {
    expect(getSlug).to.exist;
    expect(typeof getSlug).to.be.equal('function')
  })

  it('should return a slug with important nouns parsed out from a provided string', () => {
    expect(getSlug(exampleSlug)).to.be.a('string')
  })

})

