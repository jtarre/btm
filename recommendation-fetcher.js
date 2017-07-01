// recommendation-fetcher.js

var RecommendationFetcher;

RecommendationFetcher = {
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
  }

  };

module.exports = RecommendationFetcher;
