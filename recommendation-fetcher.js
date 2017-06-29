// recommendation-fetcher.js

var RecommendationFetcher;

RecommendationFetcher = {
  extractTitle: function(recommendation, publisher){
    if (publisher === "nationalreview.com"){
        return recommendation.pagemap.article[0].headline !== undefined ?
          recommendation.pagemap.article[0].headline : recommendation.title;
      }
      return recommendation.title;
    }
  };

module.exports = RecommendationFetcher;
