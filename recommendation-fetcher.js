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

  extractDate: function(recommendation, publisher){
    var pagemap = recommendation.pagemap;
    var date;
    if (publisher === "foxnews.com"){
      date = pagemap.metatags[0]['dc.date'];
    } else if (publisher === "nationalreview.com"){
      date = pagemap.article[0]['datepublished'];
    } else if (publisher === "nypost.com"){
      date = pagemap.metatags[0]['article:published_time'];
    } else if (publisher === "wsj.com"){
      date = pagemap.webpage[0]['datecreated'];
    } else if (publisher === "theatlantic.com"){
      date = pagemap.newsarticle[0]['datepublished'];
    }
    return this.formatDate(date);
  }

  };

module.exports = RecommendationFetcher;
