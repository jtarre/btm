import { isSectionPage } from '../../js/helpers/section-page'
import { siteConfigurations } from '../../js/helpers/site-configs'
const expect = require('chai').expect


describe('isSectionPage', () => {

  it('should indicate valid section pages', () => {
  	expect(isSectionPage("www.nytimes.com/section/us")).to.be.true;
  })

  it('should indicate valid section pages', () => {
  	expect(isSectionPage("www.nytimes.com/section/fashion")).to.be.false;
  })
})
