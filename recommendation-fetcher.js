const FOXNEWS = "foxnews.com"
  , NATLREVIEW = "nationalreview.com"
  , NYPOST = "nypost.com"
  , WSJ = "wsj.com"
  , ATLANTIC = "theatlantic.com"
  , VICE = "vice.com"
  , SLATE = "slate.com";

module.exports = {

  fetchRecommendation: function (apiKey, site, search, fetch) {
    var url = 'https://www.googleapis.com/customsearch/v1?q=' +
      search + ' &cx=013013877924597244999%3Atbq0ixuctim&dateRestrict=m[7]&siteSearch=' +
      site + '&key=' + apiKey;
    return fetch(url);
  },

  fetchRecommendations: function (apiKey, sites, search, fetch) {
    var recommendationPromises = [];
    for (var i = 0; i < sites.length; i++) {
      recommendationPromises.push(this.fetchRecommendation(apiKey, sites[i], search, fetch));
    }
    return recommendationPromises;
  },

  getRecommendations: function (recommendationPromises) {
    return Promise.all(recommendationPromises).then(results => results)
  },

  getTransformedRecommendations: function (recommendations, sites) {
    const transformedRecommendations = [];
    for (let i = 0; i < recommendations.length; i++) {
      transformedRecommendations.push(this.transformRecommendation(recommendations[i], sites[i]));
    }
    return transformedRecommendations;
  },

  extractHeadline: function (recommendation, publisher) {
    if (publisher === NATLREVIEW) {
      var headline = recommendation.pagemap.article[0].headline;
      return headline !== undefined ? headline : recommendation.title;
    }
    return recommendation.title;
  },

  extractLink: function (recommendation) {
    return recommendation.link;
  },

  formatDate: function (date) {
    const cutoffIndex = 16;
    return date !== undefined ? new Date(date).toUTCString().slice(0, cutoffIndex) : '';
  },

  handlePropertyLookup: function (collection, field) {
    try {
      return collection[0][field];
    }
    catch (err) {
      return undefined;
    }
  },

  extractDate: function (recommendation, publisher) {
    const pagemap = recommendation.pagemap;
    let date;
    switch (publisher) {
      case FOXNEWS:
        date = this.handlePropertyLookup(pagemap.metatags, 'dc.date')
        break
      case NATLREVIEW:
        date = this.handlePropertyLookup(pagemap.article, 'datepublished')
        break
      case NYPOST:
        date = this.handlePropertyLookup(pagemap.metatags, 'article:published_time')
        break
      case WSJ:
        date = this.handlePropertyLookup(pagemap.webpage, 'datecreated')
        break
      case ATLANTIC:
        date = this.handlePropertyLookup(pagemap.newsarticle, 'datepublished')
        break
      default:
        break;
    }
    return this.formatDate(date)
  },

  extractDescription: function (recommendation, publisher) {
    const pagemap = recommendation.pagemap;
    switch (publisher) {
      case FOXNEWS:
        return this.handlePropertyLookup(pagemap.metatags, 'dc.description')
      case NATLREVIEW:
        return this.handlePropertyLookup(pagemap.article, 'articlebody')
      case NYPOST:
        return this.handlePropertyLookup(pagemap.metatags, 'og:description')
      case WSJ:
        return this.handlePropertyLookup(pagemap.webpage, 'description')
      case ATLANTIC:
        return this.handlePropertyLookup(pagemap.newsarticle, 'description')
      case VICE:
        return this.handlePropertyLookup(pagemap.metatags, 'og:description')
      case SLATE:
        return this.handlePropertyLookup(pagemap.metatags, 'og:description')
      default:
        return ''
    }
  },

  transformRecommendation: function (recommendation, publisher) {
    return {
      headline: this.extractHeadline(recommendation, publisher),
      link: this.extractLink(recommendation, publisher),
      description: this.extractDescription(recommendation, publisher),
      date: this.extractDate(recommendation, publisher)
    };
  }

};

