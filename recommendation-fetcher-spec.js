// recommendation-fetcher.spec.js
'use strict';
var expect = require('chai').expect;
var RecommendationFetcher = require('./recommendation-fetcher.js');

describe('RecommendationFetcher', function(){
  it('should exist', function(){
    expect(RecommendationFetcher).to.not.be.undefined;
  });
});

describe('#extractTitle()', function() {
  it('should parse the title from a recommendation', function(){
    var input = {
        "title": "'Moonlight' won best picture because of Oscars' version of Electoral ...",
        "pagemap":{
        "article": [
            {
              "headline": "Why the Clinton Mental-Health Plan Won’t Succeed",
            }
          ]
        }
      };
    var expected = "'Moonlight' won best picture because of Oscars' version of Electoral ...";
    var actual = RecommendationFetcher.extractTitle(input);
    expect(actual).to.equal(expected);

    expected = "Why the Clinton Mental-Health Plan Won’t Succeed";
    actual = RecommendationFetcher.extractTitle(input, "nationalreview.com");
    expect(actual).to.equal(expected);

    input = {
        "title": "'Moonlight' won best picture because of Oscars' version of Electoral ...",
        "pagemap":{
        "article": [
            {

            }
          ]
        }
      };
    expected = "'Moonlight' won best picture because of Oscars' version of Electoral ...";
    actual = RecommendationFetcher.extractTitle(input, "nationalreview.com");
    expect(actual).to.equal(expected);
  });
});

describe('#transformRecommendation()', function(){
  it('should take a recommendation and return an object with link, headline, description, and date',
    function(){
      var input = {
         "kind": "customsearch#result",
         "title": "'Moonlight' won best picture because of Oscars' version of Electoral ...",
         "htmlTitle": "&#39;Moonlight&#39; won best picture because of \u003cb\u003eOscars\u003c/b\u003e&#39; version of Electoral ...",
         "link": "http://www.foxnews.com/entertainment/2017/02/28/moonlight-won-best-picture-because-oscars-version-electoral-college.html",
         "displayLink": "www.foxnews.com",
         "snippet": "Feb 28, 2017 ... The 89th annual Academy Awards have come and gone faster than those ... I \ndeduced that those \"La La\" loathers must have been a minority. .... isn't hard for \npeople to vote the REAL best picture down to make another rise ... going to be \ncalled the Oscars...it's gonna be called the Tyrones ..... Member Profile.",
         "htmlSnippet": "Feb 28, 2017 \u003cb\u003e...\u003c/b\u003e The 89th annual \u003cb\u003eAcademy Awards\u003c/b\u003e have come and gone faster than those ... I \u003cbr\u003e\ndeduced that those &quot;La La&quot; loathers must have been a \u003cb\u003eminority\u003c/b\u003e. .... isn&#39;t hard for \u003cbr\u003e\npeople to \u003cb\u003evote\u003c/b\u003e the REAL best picture down to make another \u003cb\u003erise\u003c/b\u003e ... \u003cb\u003egoing\u003c/b\u003e to be \u003cbr\u003e\ncalled the \u003cb\u003eOscars\u003c/b\u003e...it&#39;s gonna be called the Tyrones ..... \u003cb\u003eMember\u003c/b\u003e Profile.",
         "formattedUrl": "www.foxnews.com/.../moonlight-won-best-picture-because-oscars-version- electoral-college.html",
         "htmlFormattedUrl": "www.foxnews.com/.../moonlight-won-best-picture-because-\u003cb\u003eoscars\u003c/b\u003e-version- electoral-college.html",
         "pagemap": {
          "cse_thumbnail": [
           {
            "width": "300",
            "height": "168",
            "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1ltdGNj_u6u5ZUQVAHRcX4gdJj53eTFCOJI0kG3rushjN95KevUcuaT4"
           }
          ],
          "metatags": [
           {
            "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
            "dc.title": "'Moonlight' won best picture because of Oscars' version of Electoral College",
            "dc.description": "The 89th annual Academy Awards have come and gone faster than those sweet treats that floated from the rafters during the fun-filled ceremony.",
            "dcterms.abstract": "The 89th annual Academy Awards have come and gone faster than those sweet treats that floated from the rafters during the fun-filled ceremony.",
            "dc.publisher": "Fox News",
            "dc.creator": "Tariq Khan",
            "dc.date": "2017-02-28",
            "dcterms.created": "2017-02-28 09:07:46 EST",
            "dcterms.modified": "2017-02-28 09:07:46 EST",
            "dc.source": "Fox News",
            "dc.identifier": "6471e1b7-c0e4-4c8d-bce4-eb44bab728eb",
            "prism.aggregationtype": "subsection",
            "dc.type": "Text.Article",
            "prism.channel": "fnc",
            "prism.section": "entertainment",
            "og:title": "'Moonlight' won best picture because of Oscars' version of Electoral College",
            "og:description": "The 89th annual Academy Awards have come and gone faster than those sweet treats that floated from the rafters during the fun-filled ceremony.",
            "og:type": "article",
            "og:image": "//a57.foxnews.com/media2.foxnews.com/2017/02/27/0/0/022717_edge_awkward_1280.jpg?ve=1",
            "og:url": "http://www.foxnews.com/entertainment/2017/02/28/moonlight-won-best-picture-because-oscars-version-electoral-college.html",
            "og:site_name": "Fox News",
            "classification": "/FOX NEWS/ENTERTAINMENT/EVENTS/Oscars,/FOX NEWS/ENTERTAINMENT",
            "classification-isa": "oscars,entertainment",
            "fb:app_id": "113186182048399",
            "twitter:site": "@foxnews",
            "twitter:card": "summary_large_image",
            "twitter:title": "'Moonlight' won best picture because of Oscars' version of Electoral College",
            "twitter:description": "The 89th annual Academy Awards have come and gone faster than those sweet treats that floated from the rafters during the fun-filled ceremony.",
            "twitter:url": "http://www.foxnews.com/entertainment/2017/02/28/moonlight-won-best-picture-because-oscars-version-electoral-college.html",
            "twitter:creator": "@foxnews",
            "twitter:image": "http://a57.foxnews.com/media2.foxnews.com/2017/02/27/0/0/022717_edge_awkward_1280.jpg?ve=1",
            "dc.format": "text/html",
            "dc.language": "en-US",
            "pagetype": "article"
           }
          ]
         }
       };
      var actual = RecommendationFetcher.transformRecommendation(input);
      var expected = {
          headline: "'Moonlight' won best picture because of Oscars' version of Electoral ...",
          link: "http://www.foxnews.com/entertainment/2017/02/28/moonlight-won-best-picture-because-oscars-version-electoral-college.html",
          description: "The 89th annual Academy Awards have come and gone faster than those sweet treats that floated from the rafters during the fun-filled ceremony.",
          date: "Tue Feb 28 2017"
       };
      expect(actual).to.eql(expected);
  });
});
