// recommendation-fetcher.spec.js
'use strict';
var expect = require('chai').expect;
var RecommendationFetcher = require('../recommendation-fetcher.js');
var exampleRecommendation = {
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

describe('RecommendationFetcher', function () {
  it('should exist', function () {
    expect(RecommendationFetcher).to.not.be.undefined;
  });
});

describe('#extractHeadline()', function () {
  var input = {
    "title": "'Moonlight' won best picture because of Oscars' version of Electoral ...",
    "pagemap": {
      "article": [
        {
          "headline": "Why the Clinton Mental-Health Plan Won’t Succeed",
        }
      ]
    }
  };

  it('should parse the title from a recommendation', function () {
    var expected = "'Moonlight' won best picture because of Oscars' version of Electoral ...";
    var actual = RecommendationFetcher.extractHeadline(input);
    expect(actual).to.equal(expected);
  });

  it('should parse the headline from the nationalreview', function () {
    var expected = "Why the Clinton Mental-Health Plan Won’t Succeed";
    var actual = RecommendationFetcher.extractHeadline(input, "nationalreview.com");
    expect(actual).to.equal(expected);
  });

  it('should parse the title from a nationalreview recommendation if no headline', function () {
    input = {
      "title": "'Moonlight' won best picture because of Oscars' version of Electoral ...",
      "pagemap": {
        "article": [
          {

          }
        ]
      }
    };
    var expected = "'Moonlight' won best picture because of Oscars' version of Electoral ...";
    var actual = RecommendationFetcher.extractHeadline(input, "nationalreview.com");
    expect(actual).to.equal(expected);
  });

});

describe('#extractLink()', function () {
  it('should parse the link from a recommendation', function () {
    var input = {
      "link": "http://www.foxnews.com/entertainment/2017/02/28/moonlight-won-best-picture-because-oscars-version-electoral-college.html"
    };
    var expected = "http://www.foxnews.com/entertainment/2017/02/28/moonlight-won-best-picture-because-oscars-version-electoral-college.html";
    var actual = RecommendationFetcher.extractLink(input);
    expect(actual).to.equal(expected);
  });
});

describe('#formatDate()', function () {
  it('should return a date string that contains day, month, year in UTC and GMT', function () {
    var expected = "Thu, 28 Jul 2016";
    var actual = RecommendationFetcher.formatDate("2016-07-28");
    expect(actual).to.equal(expected);
  });
});

describe('#handlePropertyLookup()', function () {
  it('should return undefined if the input property does not exist', function () {
    var input = [{ "foo": "foo" }, { "bar": "bar" }]
    var expected = undefined;
    var actual = RecommendationFetcher.handlePropertyLookup(input, "hello");
    expect(actual).to.equal(expected);
  });
});

describe('#extractDate()', function () {
  it('should parse the date from Foxnews', function () {
    var input = {
      "pagemap": {
        "metatags": [
          {
            "dc.date": "2016-07-28"
          }
        ]
      }
    };

    var expected = "Thu, 28 Jul 2016";
    var actual = RecommendationFetcher.extractDate(input, "foxnews.com");
    expect(actual).to.equal(expected);
  });

  it('should parse the date from the national review', function () {
    var input = {
      "pagemap": {
        "article": [
          {
            "datepublished": "2016-01-21T22:00:50-05:00"
          }
        ]
      }
    };
    var expected = "Fri, 22 Jan 2016";
    var actual = RecommendationFetcher.extractDate(input, "nationalreview.com");
    expect(actual).to.equal(expected);
  });

  it('should parse the date from the NY Post', function () {
    var input = {
      "pagemap": {
        "metatags": [
          {
            "article:published_time": "2016-08-10T17:12:44+00:00"
          }
        ]
      }
    };
    var expected = "Wed, 10 Aug 2016";
    var actual = RecommendationFetcher.extractDate(input, "nypost.com");
    expect(actual).to.equal(expected);
  });

  it('should parse the date from the WSJ', function () {
    var input = {
      "pagemap": {
        "webpage": [
          {
            "datecreated": "2012-01-31T23:27:00.000Z"
          }
        ]
      }
    };
    var expected = "Tue, 31 Jan 2012";
    var actual = RecommendationFetcher.extractDate(input, "wsj.com");
    expect(actual).to.equal(expected);
  });

  it('should parse the date from the Atlantic', function () {
    var input = {
      "pagemap": {
        "newsarticle": [
          {
            "datepublished": "2016-04-19T06:30:00"
          }
        ]
      }
    };
    var expected = "Tue, 19 Apr 2016";
    var actual = RecommendationFetcher.extractDate(input, "theatlantic.com");
    expect(actual).to.equal(expected);
  });

  it("should parse nothing if there's nothing to parse", function () {
    var input = {
      "pagemap": {
        "newsarticle": []
      }
    };
    var expected = "";
    var actual = RecommendationFetcher.extractDate(input);
    expect(actual).to.equal(expected);

    input = {
      "pagemap": {
        "metatags": []
      }
    };

    actual = RecommendationFetcher.extractDate(input, "foxnews.com")
    expect(actual).to.equal(expected);

  });

});

describe('#extractDescription()', function () {
  it('should parse the description from Foxnews', function () {
    var input = {
      "pagemap": {
        "metatags": [
          {
            "dc.description": "foo"
          }
        ]
      }
    };

    var expected = "foo";
    var actual = RecommendationFetcher.extractDescription(input, "foxnews.com");
    expect(actual).to.equal(expected);
  });

  it('should parse the description from the national review', function () {
    var input = {
      "pagemap": {
        "article": [
          {
            "articlebody": "foo"
          }
        ]
      }
    };

    var expected = "foo";
    var actual = RecommendationFetcher.extractDescription(input, "nationalreview.com");
    expect(actual).to.equal(expected);
  });

  it('should parse the description from the ny post', function () {
    var input = {
      "pagemap": {
        "metatags": [
          {
            "og:description": "foo"
          }
        ]
      }
    };

    var expected = "foo";
    var actual = RecommendationFetcher.extractDescription(input, "nypost.com");
    expect(actual).to.equal(expected);
  });

  it('should parse the description from the WSJ', function () {
    var input = {
      "pagemap": {
        "webpage": [
          {
            "description": "foo"
          }
        ]
      }
    };

    var expected = "foo";
    var actual = RecommendationFetcher.extractDescription(input, "wsj.com");
    expect(actual).to.equal(expected);
  });

  it('should parse the description from the Atlantic', function () {
    var input = {
      "pagemap": {
        "newsarticle": [
          {
            "description": "foo"
          }
        ]
      }
    };

    var expected = "foo";
    var actual = RecommendationFetcher.extractDescription(input, "theatlantic.com");
    expect(actual).to.equal(expected);
  });

  it('should parse the description from vice', function () {
    var input = {
      "pagemap": {
        "metatags": [
          {
            "og:description": "foo"
          }
        ]
      }
    };

    var expected = "foo";
    var actual = RecommendationFetcher.extractDescription(input, "vice.com");
    expect(actual).to.equal(expected);
  });

  it('should parse the description from slate', function () {
    var input = {
      "pagemap": {
        "metatags": [
          {
            "og:description": "foo"
          }
        ]
      }
    };

    var expected = "foo";
    var actual = RecommendationFetcher.extractDescription(input, "slate.com");
    expect(actual).to.equal(expected);
  });

});

describe('#transformRecommendation()', function () {
  it('should take a recommendation and return an object with link, headline, description, and date',
    function () {
      var input = exampleRecommendation;
      var actual = RecommendationFetcher.transformRecommendation(input, "foxnews.com");
      var expected = {
        headline: "'Moonlight' won best picture because of Oscars' version of Electoral ...",
        link: "http://www.foxnews.com/entertainment/2017/02/28/moonlight-won-best-picture-because-oscars-version-electoral-college.html",
        description: "The 89th annual Academy Awards have come and gone faster than those sweet treats that floated from the rafters during the fun-filled ceremony.",
        date: "Tue, 28 Feb 2017"
      };
      expect(actual).to.eql(expected);
    });

  describe('#fetchRecommendation()', function () {
    it('should take an API Key, fetcher function argument, site, and search term and return a promise for JSON data', function () {
      var apiKey = 'some key';
      var site = 'foxnews.com';
      var search = 'some search';
      var fakeData = {
        "items": [exampleRecommendation]
      };
      var fakeFetcher = function (url) {
        var expectedURL = 'https://www.googleapis.com/customsearch/v1?q=' +
          search + ' &cx=013013877924597244999%3Atbq0ixuctim&dateRestrict=m[7]&siteSearch=' +
          site + '&key=' + apiKey;
        expect(url).to.equal(expectedURL);
        return Promise.resolve(fakeData);
      }

      return RecommendationFetcher.fetchRecommendation(apiKey, site, search, fakeFetcher).then(function (actual) {
        expect(actual).to.eql(fakeData);
      }
      );

    });
  });

  describe('#fetchRecommendations()', function () {
    it('should take an API Key, fetcher function argument, and a list of sites, and a search term and return a list of promises for JSON data', function () {
      var apiKey = 'some key';
      var sites = ['foxnews.com'];
      var search = 'some search';
      var fakeData = {
        "items": [exampleRecommendation]
      };
      var fakeFetcher = function (url) {
        var expectedURL = 'https://www.googleapis.com/customsearch/v1?q=' +
          search + ' &cx=013013877924597244999%3Atbq0ixuctim&dateRestrict=m[7]&siteSearch=' +
          sites[0] + '&key=' + apiKey;
        expect(url).to.equal(expectedURL);
        return Promise.resolve(fakeData);
      }

      var promises = RecommendationFetcher.fetchRecommendations(apiKey, sites, search, fakeFetcher);
      for (var i = 0; i < promises.length; i++) {
        promises[i].then(function (actual) {
          expect(actual).to.eql(fakeData);
        }
        );
      }
    });
  });

  describe('#extractRecommendation()', function () {
    it('should take a raw result from a resolved promise and return the first record from the items field', function () {
      var apiKey = 'some key';
      var recommendations;
      var sites = ['foxnews.com'];
      var search = 'some search';
      var fakeData = {
        "items": [exampleRecommendation]
      };
      var fakeFetcher = function (url) {
        var expectedURL = 'https://www.googleapis.com/customsearch/v1?q=' +
          search + ' &cx=013013877924597244999%3Atbq0ixuctim&dateRestrict=m[7]&siteSearch=' +
          sites[0] + '&key=' + apiKey;
        expect(url).to.equal(expectedURL);
        return Promise.resolve(fakeData);
      }

      var promises = RecommendationFetcher.fetchRecommendations(apiKey, sites, search, fakeFetcher);
      Promise.all(promises)
        .then(rawResults => {
          recommendations = rawResults.map(entry => RecommendationFetcher.extractRecommendation);
          expect(recommendations[0]).to.eql(exampleRecommendation);
          expect(recommendations.length).to.equal(1);
        });

    });
  });

});
