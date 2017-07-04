// recommendation-fetcher.js

var RecommendationFetcher;

RecommendationFetcher = {

  fetchRecommendation: function(apiKey, site, search, fetch){
    var url = 'https://www.googleapis.com/customsearch/v1?q=' +
    search + ' &cx=013013877924597244999%3Atbq0ixuctim&dateRestrict=m[7]&siteSearch=' +
    site + '&key=' + apiKey;
    return fetch(url);
  },

  fetchRecommendations: function(apiKey, sites, search, fetch){
    var recommendationPromises = [];
    for (var i=0; i < sites.length; i++){
      recommendationPromises.push(this.fetchRecommendation(apiKey, sites[i], search, fetch));
    }
    return recommendationPromises;
  },

  getRecommendations: function(recommendationPromises){
    var recommendations;
    $.when.apply($, recommendationPromises).then(function(){
      results = Array.prototype.slice.call(arguments);
    })
    return recommendations;
  },

  getTransformedRecommendations: function(recommendations, sites){
    var transformedRecommendations = [];
    var transformRecommendation;
    for (var i=0; i < recommendations.length; i++){
      transformedRecommendation = this.transformRecommendation(recommendation[i], sites[i]);
      transformedRecommendations.push(transformRecommendation);
    }
    return transformedRecommendations;
  },

  extractHeadline: function(recommendation, publisher){
    if (publisher === "nationalreview.com"){
      var headline = recommendation.pagemap.article[0].headline;
      return headline !== undefined ? headline : recommendation.title;
      }
      return recommendation.title;
    },

  extractLink: function(recommendation){
    return recommendation.link;
  },

  formatDate: function(date){
    var cutoffIndex = 16;
    return date != undefined ? new Date(date).toUTCString().slice(0, cutoffIndex) : "";
  },

  handlePropertyLookup: function(collection, field){
    try {
      return collection[0][field];
    }
    catch(err){
      return undefined;
    }
  },

  extractDate: function(recommendation, publisher){
    var pagemap = recommendation.pagemap;
    var date;
    if (publisher === "foxnews.com"){
      date = this.handlePropertyLookup(pagemap.metatags, 'dc.date');
    } else if (publisher === "nationalreview.com"){
      date = this.handlePropertyLookup(pagemap.article, 'datepublished');
    } else if (publisher === "nypost.com"){
      date = this.handlePropertyLookup(pagemap.metatags, 'article:published_time');
    } else if (publisher === "wsj.com"){
      date = this.handlePropertyLookup(pagemap.webpage, 'datecreated');
    } else if (publisher === "theatlantic.com"){
      date = this.handlePropertyLookup(pagemap.newsarticle, 'datepublished');
    }
    return this.formatDate(date);
  },

  extractDescription: function(recommendation, publisher){
    var pagemap = recommendation.pagemap;
    var description;
    if (publisher === "foxnews.com"){
      description = this.handlePropertyLookup(pagemap.metatags, 'dc.description');
    } else if (publisher === "nationalreview.com"){
      description = this.handlePropertyLookup(pagemap.article, 'articlebody');
    } else if (publisher == "nypost.com"){
      description = this.handlePropertyLookup(pagemap.metatags, 'og:description');
    } else if (publisher === "wsj.com"){
      description = this.handlePropertyLookup(pagemap.webpage, 'description');
    } else if (publisher === "theatlantic.com"){
      description = this.handlePropertyLookup(pagemap.newsarticle, 'description');
    } else if (publisher === "vice.com"){
      description = this.handlePropertyLookup(pagemap.metatags, 'og:description');
    } else if (publisher === "slate.com"){
      description = this.handlePropertyLookup(pagemap.metatags, 'og:description');
    }
    return description;
  },

  transformRecommendation: function(recommendation, publisher){
    return {
      headline: this.extractHeadline(recommendation, publisher),
      link: this.extractLink(recommendation, publisher),
      description: this.extractDescription(recommendation, publisher),
      date: this.extractDate(recommendation, publisher)
    };
  }

  };

module.exports = RecommendationFetcher;
