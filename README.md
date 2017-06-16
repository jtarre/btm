Version 1.4 - Added Google Analytics capabilities to BTM


approach.readme

Ok, so what would i do

onmousehover

if link
	if hrefHasNewsUrl
		get string <-- this is a thing

News articles extensions:
vox.com/dept/year/month/day/unique-id/slug
nationalreview.com/dept/unique-id/slug
breitbart.com/dept/year/month/day/slug
politico.com/dept/year/month/slug-id
nytimes.com/year/month/date/region/dept/slug

News article clean string functions:

var base = 'https://www.googleapis.com/customsearch/v1?q=site%3Anationalreview.com+trumps-obama-obsession
var cx_string = '&cx=013013877924597244999%3Atbq0ixuctim&key={YOUR_API_KEY}''

opposite_news_sites = {
	newyorktimes.com: '(site:breitbart.com or site:politico.com or site:nationalreview.com) ',
	cnn.com: '(site:breitbart.com or site:politico.com or site:nationalreview.com) '
}

function search(url) {
	var site = get_site(url)
	var clean_function = clean_function_map[site]
	var slug = clean_slug(url, clean_function)

	var search_url = search_url(slug)

}

function bridge_media_site_strings(site) {
	return opposite_news_site[site];
}

function search_url(slug) {
	return base + bridge_media_sites + 'slug' + 'cx_string'
}

function clean_slug(url, siteFn) {
	var slug = siteFn(url);
	return slug;
}

function clean_nyt(url) {
	// strip date
	// strip dept
	// etc..
	// regex?
}


Helpful links to Google's custom search:

https://developers.google.com/apis-explorer/#p/customsearch/v1/
https://console.developers.google.com/apis/credentials/key/285?project=bridge-the-media-1488660654197&pli=1
https://cse.google.com/cse/setup/basic?cx=013013877924597244999:tbq0ixuctim
https://developers.google.com/custom-search/json-api/v1/overview
https://developer.chrome.com/extensions/contentSecurityPolicy#relaxing


Sample custom search response:


 "kind": "customsearch#search",
 "url": {
  "type": "application/json",
  "template": "https://www.googleapis.com/customsearch/v1?q={searchTerms}&num={count?}&start={startIndex?}&lr={language?}&safe={safe?}&cx={cx?}&cref={cref?}&sort={sort?}&filter={filter?}&gl={gl?}&cr={cr?}&googlehost={googleHost?}&c2coff={disableCnTwTranslation?}&hq={hq?}&hl={hl?}&siteSearch={siteSearch?}&siteSearchFilter={siteSearchFilter?}&exactTerms={exactTerms?}&excludeTerms={excludeTerms?}&linkSite={linkSite?}&orTerms={orTerms?}&relatedSite={relatedSite?}&dateRestrict={dateRestrict?}&lowRange={lowRange?}&highRange={highRange?}&searchType={searchType}&fileType={fileType?}&rights={rights?}&imgSize={imgSize?}&imgType={imgType?}&imgColorType={imgColorType?}&imgDominantColor={imgDominantColor?}&alt=json"
 },
 "queries": {
  "request": [
   {
    "title": "Google Custom Search - site:nationalreview.com trumps-obama-obsession",
    "totalResults": "1100",
    "searchTerms": "site:nationalreview.com trumps-obama-obsession",
    "count": 10,
    "startIndex": 1,
    "inputEncoding": "utf8",
    "outputEncoding": "utf8",
    "safe": "off",
    "cx": "013013877924597244999:tbq0ixuctim"
   }
  ],
  "nextPage": [
   {
    "title": "Google Custom Search - site:nationalreview.com trumps-obama-obsession",
    "totalResults": "1100",
    "searchTerms": "site:nationalreview.com trumps-obama-obsession",
    "count": 10,
    "startIndex": 11,
    "inputEncoding": "utf8",
    "outputEncoding": "utf8",
    "safe": "off",
    "cx": "013013877924597244999:tbq0ixuctim"
   }
  ]
 },
 "context": {
  "title": "Bridge the Media"
 },
 "searchInformation": {
  "searchTime": 0.499345,
  "formattedSearchTime": "0.50",
  "totalResults": "1100",
  "formattedTotalResults": "1,100"
 },
 "items": [
  {
   "kind": "customsearch#result",
   "title": "The Dangerous Implications of Democrats' Obsession with Trump's...",
   "htmlTitle": "The Dangerous Implications of Democrats&#39; <b>Obsession</b> with <b>Trump&#39;s</b>...",
   "link": "http://www.nationalreview.com/article/445417/donald-trump-yemen-raid-liberal-critics-dangerous-standard",
   "displayLink": "www.nationalreview.com",
   "snippet": "2 days ago ... Donald Trump, just nine days after assuming the presidency, ordered a raid into \nYemen that had been planned during the Obama ...",
   "htmlSnippet": "2 days ago <b>...</b> Donald <b>Trump</b>, just nine days after assuming the presidency, ordered a raid into <br>\nYemen that had been planned during the <b>Obama</b>&nbsp;...",
   "cacheId": "rDYm70iKU5MJ",
   "formattedUrl": "www.nationalreview.com/.../donald-trump-yemen-raid-liberal-critics- dangerous-standard",
   "htmlFormattedUrl": "www.nationalreview.com/.../donald-<b>trump</b>-yemen-raid-liberal-critics- dangerous-standard",
   "pagemap": {
    "cse_thumbnail": [
     {
      "width": "225",
      "height": "225",
      "src": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRFkFOVui4xVUGNxIWh820mQgPFcaXVWUXM6k8xN7tYMbRHHG7uc0Jl-V8"
     }
    ],
    "imageobject": [
     {
      "url": "http://c8.nrostatic.com/sites/all/themes/nro_javelin/assets/img/logo-print.jpg",
      "width": "600",
      "height": "60"
     }
    ],
    "organization": [
     {
      "name": "National Review"
     }
    ],
    "metatags": [
     {
      "msvalidate.01": "E48498F585100158A880ED1615918208",
      "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      "fb:pages": "15779440092",
      "title": "Donald Trump Yemen Raid: Liberal Critics’ Dangerous Standard | National Review",
      "tweettext": "The Dangerous Implications of Democrats’ Obsession with Trump’s Yemen Raid",
      "news_keywords": "David French, Politics, Nation, World",
      "copyright": "© National Review, Inc.",
      "og:url": "http://www.nationalreview.com/article/445417/donald-trump-yemen-raid-liberal-critics-dangerous-standard",
      "og:type": "article",
      "og:site_name": "National Review",
      "fb:app_id": "129250807108374",
      "twitter:card": "summary",
      "sailthru.title": "The Dangerous Implications of Democrats’ Obsession with Trump’s Yemen Raid",
      "sailthru.date": "Thu, 2017-03-02 15:12",
      "sailthru.author": "David French",
      "og:image": "http://c0.nrostatic.com/sites/default/files/uploaded/donald-trump-yemen-raid-liberal-critics-dangerous-standard-r.jpg",
      "og:description": "On Saturday, December 6, 2014, there was an American commando raid in Yemen. As reported by the New York Times, special forces attacked a village in the southern part of the country in an effort to free hostages, including an American journalist, held by jihadists. But instead of accomplishing what it set out to accomplish, the raid “ended in tragedy”: Terrorists killed two hostages, including the American, and in the ensuing firefight, a number of civilians died.  That’s not a scandal; that’s war.  Fast-forward to late January of this year. Donald Trump, just nine days after assuming the presidency, ordered a raid into Yemen that had been planned during the Obama administration and endorsed by James Mattis, the new secretary of defense. During the attack, American forces encountered tougher-than-expected resistance, Navy SEAL Ryan Owens was killed, and civilians died in the crossfire. At the end of the attack, American and allied forces took possession of intelligence that may or may not (reports con",
      "og:title": "The Dangerous Implications of Democrats’ Obsession with Trump’s Yemen Raid",
      "twitter:image": "http://c8.nrostatic.com/sites/default/files/uploaded/donald-trump-yemen-raid-liberal-critics-dangerous-standard.jpg",
      "twitter:title": "The Dangerous Implications of Democrats’ Obsession with Trump’s Yemen Raid, by David French, National Review",
      "twitter:url": "http://www.nationalreview.com/article/445417/donald-trump-yemen-raid-liberal-critics-dangerous-standard",
      "twitter:description": "On Saturday, December 6, 2014, there was an American commando raid in Yemen. As reported by the New York Times, special forces attacked a village in the southern part of the country in an effort to free hostages, including an American journalist, held by jihadists. But instead of accomplishing what it set out to accomplish, the raid “ended in tragedy”: Terrorists killed two hostages, including the American, and in the ensuing firefight, a number of civilians died.  That’s not a scandal; that’s war.  Fast-forward to late January of this year. Donald Trump, just nine days after assuming the presidency, ordered a raid into Yemen that had been planned during the Obama administration and endorsed by James Mattis, the new secretary of defense. During the attack, American forces encountered tougher-than-expected resistance, Navy SEAL Ryan Owens was killed, and civilians died in the crossfire. At the end of the attack, American and allied forces took possession of intelligence that may or may not (reports con"
     }
    ],
    "cse_image": [
     {
      "src": "http://c0.nrostatic.com/sites/default/files/uploaded/donald-trump-yemen-raid-liberal-critics-dangerous-standard-r.jpg"
     }
    ],
    "article": [
     {
      "headline": "The Dangerous Implications of Democrats’ Obsession with Trump’s Yemen Raid",
      "name": "The Dangerous Implications of Democrats’ Obsession with Trump’s Yemen Raid",
      "image": "http://c8.nrostatic.com/sites/default/files/styles/original_image_with_cropping/public/uploaded/donald-trump-yemen-raid-liberal-critics-dangerous-standard.jpg?itok=UdLX1N-B",
      "author": "David French",
      "datemodified": "2017-03-02T15:14:48-05:00",
      "mainentityofpage": "http://www.nationalreview.com/article/445417/donald-trump-yemen-raid-liberal-critics-dangerous-standard",
      "datepublished": "2017-03-02T15:12:59-05:00",
      "description": "To call the raid a “failure” is to hold the military to a much different, much more limiting standard than ever before.",
      "articlebody": "On Saturday, December 6, 2014, there was an American commando raid in Yemen. As reported by the New York Times, special forces attacked a village in the southern part of the country in an effort..."
     }
    ]
   }
  },
  {
   "kind": "customsearch#result",
   "title": "Hillary Clinton & Democrats: Obama's Charm Is Great, His Coattails ...",
   "htmlTitle": "Hillary Clinton &amp; Democrats: <b>Obama&#39;s</b> Charm Is Great, His Coattails ...",
   "link": "http://www.nationalreview.com/article/442105/obama-hillary-clinton-2016-defeat-democrats",
   "displayLink": "www.nationalreview.com",
   "snippet": "Nov 10, 2016 ... Hillary Clinton ran as an Obama Democrat, focused on racial, sexual, and ... The \nparty of obsession with diversity forgot about bread-and-butter issues. ... not just \nTrump's victory but the profound damage Barack Obama has ...",
   "htmlSnippet": "Nov 10, 2016 <b>...</b> Hillary Clinton ran as an <b>Obama</b> Democrat, focused on racial, sexual, and ... The <br>\nparty of <b>obsession</b> with diversity forgot about bread-and-butter issues. ... not just <br>\n<b>Trump&#39;s</b> victory but the profound damage Barack <b>Obama</b> has&nbsp;...",
   "cacheId": "Pt6qkBSmbHAJ",
   "formattedUrl": "www.nationalreview.com/.../obama-hillary-clinton-2016-defeat-democrats",
   "htmlFormattedUrl": "www.nationalreview.com/.../<b>obama</b>-hillary-clinton-2016-defeat-democrats",
   "pagemap": {
    "cse_thumbnail": [
     {
      "width": "225",
      "height": "225",
      "src": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT8mNmHumrGynB2c2rzaWROLs6HYG5wcAKdP5hSQuUDzEhC7W6oMlL3A_Yb"
     }
    ],
    "imageobject": [
     {
      "url": "http://c8.nrostatic.com/sites/all/themes/nro_javelin/assets/img/logo-print.jpg",
      "width": "600",
      "height": "60"
     }
    ],
    "organization": [
     {
      "name": "National Review"
     }
    ],
    "metatags": [
     {
      "msvalidate.01": "E48498F585100158A880ED1615918208",
      "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      "fb:pages": "15779440092",
      "title": "Hillary Clinton & Democrats: Obama’s Charm Is Great, His Coattails Short | National Review",
      "twitter:description": "Hillary Clinton ran as an Obama Democrat, focused on racial, sexual, and gender inclusion, but without his charm or a grasp of bread-and-butter issues.",
      "og:description": "Hillary Clinton ran as an Obama Democrat, focused on racial, sexual, and gender inclusion, but without his charm or a grasp of bread-and-butter issues.",
      "sailthru.tags": "politics, hillary-clinton, barack-obama, democrats, voters, jonah-goldberg, article, medium",
      "tweettext": "Hillary Clinton ran as an Obama Democrat, focused on racial, sexual, and gender inclusion, but without his charm or a grasp of bread-and-butter issues.",
      "og:url": "http://www.nationalreview.com/article/442105/hillary-clinton-democrats-obamas-charm-great-his-coattails-short",
      "og:type": "article",
      "og:site_name": "National Review",
      "fb:app_id": "129250807108374",
      "sailthru.title": "Obama Helped Pave the Way for Clinton’s Defeat",
      "sailthru.author": "Jonah Goldberg",
      "og:image": "http://c1.nrostatic.com/sites/default/files/uploaded/obama-hillary-clinton-2016-defeat-democrats-r.jpg",
      "og:title": "Obama Helped Pave the Way for Clinton’s Defeat",
      "twitter:image": "http://c6.nrostatic.com/sites/default/files/uploaded/obama-hillary-clinton-2016-defeat-democrats.jpg",
      "twitter:title": "Obama Helped Pave the Way for Clinton’s Defeat, by Jonah Goldberg, National Review",
      "twitter:url": "http://www.nationalreview.com/article/442105/hillary-clinton-democrats-obamas-charm-great-his-coattails-short",
      "twitter:card": "summary",
      "copyright": "© National Review, Inc.",
      "news_keywords": "Jonah Goldberg, Politics, Nation, World",
      "sailthru.date": "Thu, 2016-11-10 23:00"
     }
    ],
    "cse_image": [
     {
      "src": "http://c1.nrostatic.com/sites/default/files/uploaded/obama-hillary-clinton-2016-defeat-democrats-r.jpg"
     }
    ],
    "article": [
     {
      "headline": "Obama Helped Pave the Way for Clinton’s Defeat",
      "name": "Obama Helped Pave the Way for Clinton’s Defeat",
      "image": "http://c6.nrostatic.com/sites/default/files/styles/original_image_with_cropping/public/uploaded/obama-hillary-clinton-2016-defeat-democrats.jpg?itok=tVNipn8Z",
      "author": "Jonah Goldberg",
      "datemodified": "2016-11-11T14:25:32-05:00",
      "mainentityofpage": "http://www.nationalreview.com/article/442105/hillary-clinton-democrats-obamas-charm-great-his-coattails-short",
      "datepublished": "2016-11-10T23:00:00-05:00",
      "description": "The party of obsession with diversity forgot about bread-and-butter issues.",
      "articlebody": "While many are starting to grasp the enormity of Donald Trump’s victory, few seem interested in coming to grips with the significance of Hillary Clinton’s defeat. It’s understandable,..."
     }
    ]
   }
  },
  {
   "kind": "customsearch#result",
   "title": "Birtherism, Sidney Blumenthal, White House Correspondents ...",
   "htmlTitle": "Birtherism, Sidney Blumenthal, White House Correspondents ...",
   "link": "http://www.nationalreview.com/article/442158/birtherism-sidney-blumenthal-white-house-correspondents-dinner-trump-victory",
   "displayLink": "www.nationalreview.com",
   "snippet": "Nov 13, 2016 ... ... media that slammed Trump for his birther obsession has long failed to ... \nTrump's attacks clearly irked Obama, and in April 2011, Obama ...",
   "htmlSnippet": "Nov 13, 2016 <b>...</b> ... media that slammed <b>Trump</b> for his birther <b>obsession</b> has long failed to ... <br>\n<b>Trump&#39;s</b> attacks clearly irked <b>Obama</b>, and in April 2011, <b>Obama</b>&nbsp;...",
   "cacheId": "p2okaL33xLMJ",
   "formattedUrl": "www.nationalreview.com/.../birtherism-sidney-blumenthal-white-house- correspondents-dinner-trump-victory",
   "htmlFormattedUrl": "www.nationalreview.com/.../birtherism-sidney-blumenthal-white-house- correspondents-dinner-<b>trump</b>-victory",
   "pagemap": {
    "cse_thumbnail": [
     {
      "width": "225",
      "height": "225",
      "src": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT57XNQuoNqRAlufeOyP1vW9NVs7Q-t1BjmtqDEMUGlI2wh1ezNLtPFOVI5"
     }
    ],
    "imageobject": [
     {
      "url": "http://c8.nrostatic.com/sites/all/themes/nro_javelin/assets/img/logo-print.jpg",
      "width": "600",
      "height": "60"
     }
    ],
    "organization": [
     {
      "name": "National Review"
     }
    ],
    "metatags": [
     {
      "msvalidate.01": "E48498F585100158A880ED1615918208",
      "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      "fb:pages": "15779440092",
      "title": "Birtherism, Sidney Blumenthal, White House Correspondents’ Dinner, Trump Victory | National Review",
      "og:type": "article",
      "og:url": "http://www.nationalreview.com/article/442158/birtherism-sidney-blumenthal-white-house-correspondents-dinner-trump-victory",
      "sailthru.title": "Sidney Blumenthal, Birtherism, and the Law of Unintended Consequences",
      "og:site_name": "National Review",
      "fb:app_id": "129250807108374",
      "sailthru.date": "Sun, 2016-11-13 21:00",
      "sailthru.tags": "politics, 2008, sidney-blumenthal, hillary-clinton, donald-trump, john-fund, article, long",
      "tweettext": "Did Sid Blumenthal’s injection of the birther issue in the 2008 campaign lead to a sequence of events that resulted in Hillary’s undoing?",
      "twitter:description": "Did Sid Blumenthal’s injection of the birther issue in the 2008 campaign lead to a sequence of events that resulted in Hillary’s undoing?",
      "og:description": "Did Sid Blumenthal’s injection of the birther issue in the 2008 campaign lead to a sequence of events that resulted in Hillary’s undoing?",
      "news_keywords": "John Fund, Politics, Nation, World",
      "copyright": "© National Review, Inc.",
      "og:title": "Sidney Blumenthal, Birtherism, and the Law of Unintended Consequences",
      "og:image": "http://c4.nrostatic.com/sites/default/files/uploaded/pic_related_111216_blumenthal.jpg",
      "twitter:image": "http://c10.nrostatic.com/sites/default/files/uploaded/pic_giant_111316_blumenthal.jpg",
      "twitter:title": "Sidney Blumenthal, Birtherism, and the Law of Unintended Consequences, by John Fund, National Review",
      "twitter:card": "summary",
      "twitter:url": "http://www.nationalreview.com/article/442158/birtherism-sidney-blumenthal-white-house-correspondents-dinner-trump-victory",
      "sailthru.author": "John Fund"
     }
    ],
    "cse_image": [
     {
      "src": "http://c4.nrostatic.com/sites/default/files/uploaded/pic_related_111216_blumenthal.jpg"
     }
    ],
    "article": [
     {
      "headline": "Sidney Blumenthal, Birtherism, and the Law of Unintended Consequences",
      "name": "Sidney Blumenthal, Birtherism, and the Law of Unintended Consequences",
      "image": "http://c10.nrostatic.com/sites/default/files/styles/original_image_with_cropping/public/uploaded/pic_giant_111316_blumenthal.jpg?itok=l8UxkG_T",
      "author": "John Fund",
      "datemodified": "2016-11-14T13:36:31-05:00",
      "mainentityofpage": "http://www.nationalreview.com/article/442158/birtherism-sidney-blumenthal-white-house-correspondents-dinner-trump-victory",
      "datepublished": "2016-11-13T21:00:12-05:00",
      "description": "Sidney Blumenthal’s opposition research in 2008 may have had unintended consequences.",
      "articlebody": "Historians will be writing for decades about how Donald Trump improbably became president. Here’s one angle I hope they don’t ignore. Hillary Clinton’s 2008 supporters set in motion Trump’s..."
     }
    ]
   }
  },
  {
   "kind": "customsearch#result",
   "title": "Obama & FISA: Trump Wiretap May Have Been Sought | National ...",
   "htmlTitle": "<b>Obama</b> &amp; FISA: <b>Trump</b> Wiretap May Have Been Sought | National ...",
   "link": "http://www.nationalreview.com/article/443768/obama-fisa-trump-wiretap",
   "displayLink": "www.nationalreview.com",
   "snippet": "Jan 11, 2017 ... The Obama Justice Department may have sought to wiretap Trump and his \nassociates ... claim that the Obama Justice Department and the FBI sought FISA \nwarrants against .... The Media/Liberal Obsession With Conclusions.",
   "htmlSnippet": "Jan 11, 2017 <b>...</b> The <b>Obama</b> Justice Department may have sought to wiretap <b>Trump</b> and his <br>\nassociates ... claim that the <b>Obama</b> Justice Department and the FBI sought FISA <br>\nwarrants against .... The Media/Liberal <b>Obsession</b> With Conclusions.",
   "cacheId": "ichrmssJmkIJ",
   "formattedUrl": "www.nationalreview.com/article/443768/obama-fisa-trump-wiretap",
   "htmlFormattedUrl": "www.nationalreview.com/article/443768/<b>obama</b>-fisa-<b>trump</b>-wiretap",
   "pagemap": {
    "cse_thumbnail": [
     {
      "width": "225",
      "height": "225",
      "src": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTiOVuh5ww0uEpa71EJmGn-x5_txany-TKaOukZo5s7PrmkOEHAcz_otz4"
     }
    ],
    "imageobject": [
     {
      "url": "http://c8.nrostatic.com/sites/all/themes/nro_javelin/assets/img/logo-print.jpg",
      "width": "600",
      "height": "60"
     }
    ],
    "organization": [
     {
      "name": "National Review"
     }
    ],
    "metatags": [
     {
      "msvalidate.01": "E48498F585100158A880ED1615918208",
      "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      "fb:pages": "15779440092",
      "title": "Obama & FISA: Trump Wiretap May Have Been Sought | National Review",
      "twitter:description": "The Obama Justice Department may have sought to wiretap Trump and his associates under the FISA counterterrorism statute",
      "og:description": "The Obama Justice Department may have sought to wiretap Trump and his associates under the FISA counterterrorism statute",
      "sailthru.tags": "policy, obama-administration, national-security, donald-trump, 2016, andrew-c-mccarthy, article, long",
      "tweettext": "The Obama Justice Department may have sought to wiretap Trump and his associates under the FISA counterterrorism statute",
      "og:url": "http://www.nationalreview.com/article/443768/obama-fisa-trump-wiretap",
      "og:type": "article",
      "og:site_name": "National Review",
      "fb:app_id": "129250807108374",
      "sailthru.title": "FISA and the Trump Team",
      "sailthru.author": "Andrew C. McCarthy",
      "og:image": "http://c2.nrostatic.com/sites/default/files/uploaded/obama-fisa-trump-wiretap-r.jpg",
      "og:title": "FISA and the Trump Team",
      "twitter:image": "http://c4.nrostatic.com/sites/default/files/uploaded/obama-fisa-trump-wiretap.jpg",
      "twitter:title": "FISA and the Trump Team, by Andrew C. McCarthy, National Review",
      "twitter:url": "http://www.nationalreview.com/article/443768/obama-fisa-trump-wiretap",
      "twitter:card": "summary",
      "copyright": "© National Review, Inc.",
      "news_keywords": "Andrew C. McCarthy, Politics, Nation, World",
      "sailthru.date": "Wed, 2017-01-11 15:02"
     }
    ],
    "cse_image": [
     {
      "src": "http://c2.nrostatic.com/sites/default/files/uploaded/obama-fisa-trump-wiretap-r.jpg"
     }
    ],
    "article": [
     {
      "headline": "FISA and the Trump Team",
      "name": "FISA and the Trump Team",
      "image": "http://c4.nrostatic.com/sites/default/files/styles/original_image_with_cropping/public/uploaded/obama-fisa-trump-wiretap.jpg?itok=0xA0R5N-",
      "author": "Andrew C. McCarthy",
      "datemodified": "2017-01-12T15:34:06-05:00",
      "mainentityofpage": "http://www.nationalreview.com/article/443768/obama-fisa-trump-wiretap",
      "datepublished": "2017-01-11T15:02:47-05:00",
      "description": "The idea that FISA could be used against political enemies always seemed far-fetched. Now it might not be.",
      "articlebody": "Remember the great debate over “the Wall” following the 9/11 attacks? “The Wall” was a set of internal guidelines that had been issued by the Clinton Justice Department in the mid 1990s...."
     }
    ]
   }
  },
  {
   "kind": "customsearch#result",
   "title": "Donald Trump's Obsession with Seizing Middle Eastern Oil Fields ...",
   "htmlTitle": "Donald <b>Trump&#39;s Obsession</b> with Seizing Middle Eastern Oil Fields ...",
   "link": "http://www.nationalreview.com/article/421825/donald-trumps-odd-fixation-seizing-middle-eastern-oil-fields-jim-geraghty",
   "displayLink": "www.nationalreview.com",
   "snippet": "Jul 30, 2015 ... Four years later, as Obama prepared to withdraw U.S. troops from the country, \nTrump was more or less getting his wish. But by then he ...",
   "htmlSnippet": "Jul 30, 2015 <b>...</b> Four years later, as <b>Obama</b> prepared to withdraw U.S. troops from the country, <br>\n<b>Trump</b> was more or less getting his wish. But by then he&nbsp;...",
   "cacheId": "ro2NCN9zfFoJ",
   "formattedUrl": "www.nationalreview.com/.../donald-trumps-odd-fixation-seizing-middle- eastern-oil-fields-jim-geraghty",
   "htmlFormattedUrl": "www.nationalreview.com/.../donald-<b>trumps</b>-odd-fixation-seizing-middle- eastern-oil-fields-jim-geraghty",
   "pagemap": {
    "cse_thumbnail": [
     {
      "width": "225",
      "height": "225",
      "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc3UkLXeBFA43cCg4NX2cZde-k_keHNCOcQmUMQoV1ECfyR-eF0ylvbEuM"
     }
    ],
    "imageobject": [
     {
      "url": "http://c8.nrostatic.com/sites/all/themes/nro_javelin/assets/img/logo-print.jpg",
      "width": "600",
      "height": "60"
     }
    ],
    "organization": [
     {
      "name": "National Review"
     }
    ],
    "metatags": [
     {
      "msvalidate.01": "E48498F585100158A880ED1615918208",
      "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      "fb:pages": "15779440092",
      "title": "Donald Trump's Obsession with Seizing Middle Eastern Oil Fields | National Review",
      "tweettext": "Trump has in recent years repeatedly endorsed the bizarre, bellicose fantasy that the U.S. could and should seize oil fields in Iraq and Libya.",
      "news_keywords": "Jim Geraghty, donald trump foreign policy, donald trump middle east, donald trump oil fields, foreign policy donald trump, donald trump 2016 campaign, donald trump foreign affairs",
      "og:description": "Trump has in recent years repeatedly endorsed the bizarre, bellicose fantasy that the U.S. could and should seize oil fields in Iraq and Libya.",
      "sailthru.tags": "politics, foreign-policy, donald-trump, middle-east, 2016, jim-geraghty, article, long",
      "og:url": "http://www.nationalreview.com/article/421825/donald-trumps-odd-fixation-seizing-middle-eastern-oil-fields-jim-geraghty",
      "og:type": "article",
      "og:site_name": "National Review",
      "fb:app_id": "129250807108374",
      "twitter:description": "Trump has in recent years repeatedly endorsed the bizarre, bellicose fantasy that the U.S. could and should seize oil fields in Iraq and Libya.",
      "sailthru.date": "Thu, 2015-07-30 15:57",
      "sailthru.author": "Jim Geraghty",
      "og:image": "http://c10.nrostatic.com/sites/default/files/uploaded/donald-trump-iraq-strategy-cr.jpg",
      "og:title": "Donald Trump&#8217;s Odd Fixation on Seizing Middle Eastern Oil Fields",
      "twitter:image": "http://c3.nrostatic.com/sites/default/files/uploaded/donald-trump-iraq-strategy-c.jpg",
      "twitter:title": "Donald Trump&#8217;s Odd Fixation on Seizing Middle Eastern Oil Fields, by Jim Geraghty, National Review",
      "twitter:url": "http://www.nationalreview.com/article/421825/donald-trumps-odd-fixation-seizing-middle-eastern-oil-fields-jim-geraghty",
      "twitter:card": "summary",
      "copyright": "© National Review, Inc.",
      "sailthru.title": "Donald Trump&#8217;s Odd Fixation on Seizing Middle Eastern Oil Fields"
     }
    ],
    "cse_image": [
     {
      "src": "http://c10.nrostatic.com/sites/default/files/uploaded/donald-trump-iraq-strategy-cr.jpg"
     }
    ],
    "article": [
     {
      "headline": "Donald Trump’s Odd Fixation on Seizing Middle Eastern Oil Fields",
      "name": "Donald Trump’s Odd Fixation on Seizing Middle Eastern Oil Fields",
      "image": "http://c3.nrostatic.com/sites/default/files/styles/original_image_with_cropping/public/uploaded/donald-trump-iraq-strategy-c.jpg?itok=4kyC07dY",
      "author": "Jim Geraghty",
      "datemodified": "2015-07-31T09:23:18-04:00",
      "mainentityofpage": "http://www.nationalreview.com/article/421825/donald-trumps-odd-fixation-seizing-middle-eastern-oil-fields-jim-geraghty",
      "datepublished": "2015-07-30T15:57:43-04:00",
      "description": "Trump has in recent years repeatedly endorsed the bizarre, bellicose fantasy that the U.S. could and should seize oil fields in Iraq and Libya.",
      "articlebody": "Since announcing his campaign for the Republican presidential nomination, Donald Trump has made clear that he’s a different kind of candidate. He’s loud, he’s brash, and he’s got an..."
     }
    ]
   }
  },
  {
   "kind": "customsearch#result",
   "title": "David Petraeus -- Barack Obama's Obsession",
   "htmlTitle": "David Petraeus -- Barack <b>Obama&#39;s Obsession</b>",
   "link": "http://www.nationalreview.com/article/430375/david-petraeus-barack-obamas-obsession",
   "displayLink": "www.nationalreview.com",
   "snippet": "Jan 28, 2016 ... The Obama administration is obsessed with punishing General David Petraeus, \ndespite his military accomplishments.",
   "htmlSnippet": "Jan 28, 2016 <b>...</b> The <b>Obama</b> administration is <b>obsessed</b> with punishing General David Petraeus, <br>\ndespite his military accomplishments.",
   "cacheId": "xNBFwV-mTXkJ",
   "formattedUrl": "www.nationalreview.com/.../david-petraeus-barack-obamas-obsession",
   "htmlFormattedUrl": "www.nationalreview.com/.../david-petraeus-barack-<b>obamas</b>-<b>obsession</b>",
   "pagemap": {
    "cse_thumbnail": [
     {
      "width": "225",
      "height": "225",
      "src": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQDeJYRDT1r8mSx6xljaIGR1-7-N6s90aqh6vcT9rP3jwYJPZTkpNHLqog"
     }
    ],
    "imageobject": [
     {
      "url": "http://c8.nrostatic.com/sites/all/themes/nro_javelin/assets/img/logo-print.jpg",
      "width": "600",
      "height": "60"
     }
    ],
    "organization": [
     {
      "name": "National Review"
     }
    ],
    "metatags": [
     {
      "msvalidate.01": "E48498F585100158A880ED1615918208",
      "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      "fb:pages": "15779440092",
      "title": "David Petraeus -- Barack Obama's Obsession",
      "tweettext": "The Obama administration is obsessed with punishing General David Petraeus, despite his military accomplishments.",
      "news_keywords": "david petraeus obama administration, david petraeus guilty plea, david petraeus classified information, david petraeus hillary clinton, david petraeus paula broadwell",
      "og:description": "The Obama administration is obsessed with punishing General David Petraeus, despite his military accomplishments.",
      "sailthru.tags": "the-law, hillary-clinton, obama-administration, 2016, david-petraeus, victor-davis-hanson, article, medium",
      "og:url": "http://www.nationalreview.com/article/430375/david-petraeus-barack-obamas-obsession",
      "og:type": "article",
      "og:site_name": "National Review",
      "fb:app_id": "129250807108374",
      "twitter:description": "The Obama administration is obsessed with punishing General David Petraeus, despite his military accomplishments.",
      "sailthru.date": "Thu, 2016-01-28 00:00",
      "sailthru.author": "Victor Davis Hanson",
      "og:image": "http://c10.nrostatic.com/sites/default/files/uploaded/david-petraeus-obsession-obama-r.jpg",
      "og:title": "The Obama Administration Needs to Abandon Its Petraeus Obsession",
      "twitter:image": "http://c5.nrostatic.com/sites/default/files/uploaded/david-petraeus-obsession-obama.jpg",
      "twitter:title": "The Obama Administration Needs to Abandon Its Petraeus Obsession , by Victor Davis Hanson, National Review",
      "twitter:url": "http://www.nationalreview.com/article/430375/david-petraeus-barack-obamas-obsession",
      "twitter:card": "summary",
      "copyright": "© National Review, Inc.",
      "sailthru.title": "The Obama Administration Needs to Abandon Its Petraeus Obsession"
     }
    ],
    "cse_image": [
     {
      "src": "http://c10.nrostatic.com/sites/default/files/uploaded/david-petraeus-obsession-obama-r.jpg"
     }
    ],
    "article": [
     {
      "headline": "The Obama Administration Needs to Abandon Its Petraeus Obsession",
      "name": "The Obama Administration Needs to Abandon Its Petraeus Obsession",
      "image": "http://c5.nrostatic.com/sites/default/files/styles/original_image_with_cropping/public/uploaded/david-petraeus-obsession-obama.jpg?itok=FzYaIJFg",
      "author": "Victor Davis Hanson",
      "datemodified": "2016-01-28T12:52:32-05:00",
      "mainentityofpage": "http://www.nationalreview.com/article/430375/david-petraeus-barack-obamas-obsession",
      "datepublished": "2016-01-28T00:00:00-05:00",
      "description": "The Obama administration is obsessed with punishing General David Petraeus, despite his military accomplishments.",
      "articlebody": "In politically driven moods, the ancient Romans often wiped from history all mention of a prior hero or celebrity. They called such erasures damnatio memoriae. The Soviet Union likewise airbrushed..."
     }
    ]
   }
  },
  {
   "kind": "customsearch#result",
   "title": "Donald Trump & Washington Post | National Review",
   "htmlTitle": "Donald <b>Trump</b> &amp; Washington Post | National Review",
   "link": "http://www.nationalreview.com/corner/436559/donald-trump-washington-post",
   "displayLink": "www.nationalreview.com",
   "snippet": "Jun 13, 2016 ... The Washington Post ran a story headlined, “Trump suggests President Obama \nwas involved with the mass shooting in Orlando.” Later that ...",
   "htmlSnippet": "Jun 13, 2016 <b>...</b> The Washington Post ran a story headlined, “<b>Trump</b> suggests President <b>Obama</b> <br>\nwas involved with the mass shooting in Orlando.” Later that&nbsp;...",
   "cacheId": "b42YXU42x3kJ",
   "formattedUrl": "www.nationalreview.com/corner/.../donald-trump-washington-post",
   "htmlFormattedUrl": "www.nationalreview.com/corner/.../donald-<b>trump</b>-washington-post",
   "pagemap": {
    "cse_thumbnail": [
     {
      "width": "225",
      "height": "225",
      "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScM6rcYiGRK_nft3vZ1Cq7fsnRmYG8n0qTAhmP7YX5udWHlo5TJvs1R7-C"
     }
    ],
    "imageobject": [
     {
      "url": "http://c8.nrostatic.com/sites/all/themes/nro_javelin/assets/img/logo-print.jpg",
      "width": "600",
      "height": "60"
     }
    ],
    "organization": [
     {
      "name": "National Review"
     }
    ],
    "metatags": [
     {
      "msvalidate.01": "E48498F585100158A880ED1615918208",
      "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      "fb:pages": "15779440092",
      "title": "Donald Trump & Washington Post | National Review",
      "tweettext": "Donald Trump said a Washington Post headline was \"dishonest\" and then announced that his campaign was revoking the Post's press credentials.",
      "news_keywords": "donald trump 2016, donald trump 2016 gop debate, donald trump polls, donald trump gop polls, gop 2016 polls, donald trump for president",
      "og:description": "Donald Trump said a Washington Post headline was \"dishonest\" and then announced that his campaign was revoking the Post's press credentials.",
      "sailthru.tags": "politics, donald-trump, washington-post, orlando-shooting, barack-obama, ramesh-ponnuru, blog, short",
      "og:url": "http://www.nationalreview.com/corner/436559/donald-trump-washington-post",
      "og:type": "article",
      "og:site_name": "National Review",
      "fb:app_id": "129250807108374",
      "twitter:description": "Donald Trump said a Washington Post headline was \"dishonest\" and then announced that his campaign was revoking the Post's press credentials.",
      "sailthru.date": "Mon, 2016-06-13 17:29",
      "sailthru.author": "Ramesh Ponnuru",
      "og:image": "http://c8.nrostatic.com/sites/default/files/uploaded/related_donald-trump3_gd_160122_1.jpg",
      "og:title": "Trump vs. the Washington Post",
      "twitter:title": "Trump vs. the Washington Post, by Ramesh Ponnuru, National Review",
      "twitter:url": "http://www.nationalreview.com/corner/436559/donald-trump-washington-post",
      "twitter:card": "summary",
      "copyright": "© National Review, Inc.",
      "sailthru.title": "Trump vs. the Washington Post"
     }
    ],
    "cse_image": [
     {
      "src": "http://c8.nrostatic.com/sites/default/files/uploaded/related_donald-trump3_gd_160122_1.jpg"
     }
    ],
    "article": [
     {
      "headline": "Trump vs. the <i>Washington Post</i>",
      "name": "Trump vs. the <i>Washington Post</i>",
      "author": "Ramesh Ponnuru",
      "datemodified": "2016-06-14T11:27:15-04:00",
      "mainentityofpage": "http://www.nationalreview.com/corner/436559/donald-trump-washington-post",
      "datepublished": "2016-06-13T17:29:45-04:00",
      "articlebody": "This morning, Trump told Fox News, “Look, we’re led by a man that either is not tough, not smart, or he’s got something else in mind. And the something else in mind — you know, people..."
     }
    ]
   }
  },
  {
   "kind": "customsearch#result",
   "title": "Donald Trump's 'Conservative' Agenda: Not Radical, More Centrist ...",
   "htmlTitle": "Donald <b>Trump&#39;s</b> &#39;Conservative&#39; Agenda: Not Radical, More Centrist ...",
   "link": "http://www.nationalreview.com/article/444494/donald-trumps-conservative-agenda-not-radical-more-centrist",
   "displayLink": "www.nationalreview.com",
   "snippet": "Feb 2, 2017 ... Donald Trump seems a revolutionary, but that is only because he is loudly \nundoing Obama's revolution.",
   "htmlSnippet": "Feb 2, 2017 <b>...</b> Donald <b>Trump</b> seems a revolutionary, but that is only because he is loudly <br>\nundoing <b>Obama&#39;s</b> revolution.",
   "cacheId": "5uKhE8DHCVgJ",
   "formattedUrl": "www.nationalreview.com/.../donald-trumps-conservative-agenda-not-radical- more-centrist",
   "htmlFormattedUrl": "www.nationalreview.com/.../donald-<b>trumps</b>-conservative-agenda-not-radical- more-centrist",
   "pagemap": {
    "cse_thumbnail": [
     {
      "width": "225",
      "height": "225",
      "src": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSmKcQGtucVWfT8bhQpcKr8dK-hYFrJXvMLlLmsYCLNYX7qfiY1L2aXXJdP"
     }
    ],
    "imageobject": [
     {
      "url": "http://c8.nrostatic.com/sites/all/themes/nro_javelin/assets/img/logo-print.jpg",
      "width": "600",
      "height": "60"
     }
    ],
    "organization": [
     {
      "name": "National Review"
     }
    ],
    "metatags": [
     {
      "msvalidate.01": "E48498F585100158A880ED1615918208",
      "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      "fb:pages": "15779440092",
      "title": "Donald Trump’s ‘Conservative’ Agenda: Not Radical, More Centrist | National Review",
      "tweettext": "Donald Trump seems a revolutionary, but that is only because he is loudly undoing Obama's revolution.",
      "og:description": "Donald Trump seems a revolutionary, but that is only because he is loudly undoing Obama's revolution.",
      "sailthru.tags": "politics, obama-administration, trump-administration, constitution, conservatoves, victor-davis-hanson, article, medium",
      "og:url": "http://www.nationalreview.com/article/444494/donald-trump-conservative-agenda-not-radical-more-centrist",
      "og:type": "article",
      "og:site_name": "National Review",
      "fb:app_id": "129250807108374",
      "twitter:description": "Donald Trump seems a revolutionary, but that is only because he is loudly undoing Obama's revolution.",
      "sailthru.title": "When Normalcy Is Revolution",
      "sailthru.author": "Victor Davis Hanson",
      "og:image": "http://c1.nrostatic.com/sites/default/files/uploaded/donald-trump-conservative-agenda-not-radical-more-centrist-r.jpg",
      "og:title": "When Normalcy Is Revolution",
      "twitter:image": "http://c2.nrostatic.com/sites/default/files/uploaded/donald-trump-conservative-agenda-not-radical-more-centrist.jpg",
      "twitter:title": "When Normalcy Is Revolution, by Victor Davis Hanson, National Review",
      "twitter:url": "http://www.nationalreview.com/article/444494/donald-trump-conservative-agenda-not-radical-more-centrist",
      "twitter:card": "summary",
      "copyright": "© National Review, Inc.",
      "news_keywords": "Victor Davis Hanson, Politics, Nation, World",
      "sailthru.date": "Thu, 2017-02-02 00:00"
     }
    ],
    "cse_image": [
     {
      "src": "http://c1.nrostatic.com/sites/default/files/uploaded/donald-trump-conservative-agenda-not-radical-more-centrist-r.jpg"
     }
    ],
    "article": [
     {
      "headline": "When Normalcy Is Revolution",
      "name": "When Normalcy Is Revolution",
      "image": "http://c2.nrostatic.com/sites/default/files/styles/original_image_with_cropping/public/uploaded/donald-trump-conservative-agenda-not-radical-more-centrist.jpg?itok=mdVVdUsC",
      "author": "Victor Davis Hanson",
      "datemodified": "2017-02-03T05:07:07-05:00",
      "mainentityofpage": "http://www.nationalreview.com/article/444494/donald-trump-conservative-agenda-not-radical-more-centrist",
      "datepublished": "2017-02-02T00:00:00-05:00",
      "description": "Trump’s often unorthodox style shouldn’t be confused with his otherwise practical and mostly centrist agenda.",
      "articlebody": "By 2008, America was politically split nearly 50/50 as it had been in 2000 and 2004. The Democrats took a gamble and nominated Barack Obama, who became the first young, Northern, liberal president..."
     }
    ]
   }
  },
  {
   "kind": "customsearch#result",
   "title": "Donald Trump Video Shows His Obsession with Celebrity, Not Just ...",
   "htmlTitle": "Donald <b>Trump</b> Video Shows His <b>Obsession</b> with Celebrity, Not Just ...",
   "link": "http://www.nationalreview.com/article/440969/donald-trump-video-shows-his-obsession-celebrity-not-just-sexism",
   "displayLink": "www.nationalreview.com",
   "snippet": "Oct 12, 2016 ... That was Donald Trump explaining to Billy Bush of Access Hollywood what it's \nlike “when you're a star” in the now-infamous hot-mic incident ...",
   "htmlSnippet": "Oct 12, 2016 <b>...</b> That was Donald <b>Trump</b> explaining to Billy Bush of Access Hollywood what it&#39;s <br>\nlike “when you&#39;re a star” in the now-infamous hot-mic incident&nbsp;...",
   "cacheId": "_6c8eccz6o8J",
   "formattedUrl": "www.nationalreview.com/.../donald-trump-video-shows-his-obsession- celebrity-not-just-sexism",
   "htmlFormattedUrl": "www.nationalreview.com/.../donald-<b>trump</b>-video-shows-his-<b>obsession</b>- celebrity-not-just-sexism",
   "pagemap": {
    "cse_thumbnail": [
     {
      "width": "225",
      "height": "225",
      "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVs9umNPbefRRyFdIVAdJRfQ_VzvM6mVOH2M5QMctNjlfTHi2cshf9kkA"
     }
    ],
    "imageobject": [
     {
      "url": "http://c8.nrostatic.com/sites/all/themes/nro_javelin/assets/img/logo-print.jpg",
      "width": "600",
      "height": "60"
     }
    ],
    "organization": [
     {
      "name": "National Review"
     }
    ],
    "metatags": [
     {
      "msvalidate.01": "E48498F585100158A880ED1615918208",
      "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      "fb:pages": "15779440092",
      "title": "Donald Trump Video Shows His Obsession with Celebrity, Not Just Sexism | National Review",
      "twitter:description": "Donald Trump’s Access Hollywood comments show he cares about his celebrity status above all, and Republicans have shown themselves too susceptible to its pull.",
      "og:description": "Donald Trump’s Access Hollywood comments show he cares about his celebrity status above all, and Republicans have shown themselves too susceptible to its pull.",
      "sailthru.tags": "culture, celebrities, republicans, donald-trump, access-hollywood, jonah-goldberg, article, medium",
      "tweettext": "Donald Trump’s Access Hollywood comments show he cares about his celebrity status above all, and Republicans have shown themselves too susceptible to its pull.",
      "og:url": "http://www.nationalreview.com/article/440969/donald-trump-video-shows-his-obsession-celebrity-not-just-sexism",
      "og:type": "article",
      "og:site_name": "National Review",
      "fb:app_id": "129250807108374",
      "sailthru.title": "Bending to Trump’s Star Power",
      "sailthru.author": "Jonah Goldberg",
      "og:image": "http://c5.nrostatic.com/sites/default/files/uploaded/donald-trump-video-shows-his-obsession-celebrity-not-just-sexism-r.jpg",
      "og:title": "Bending to Trump’s Star Power",
      "twitter:image": "http://c1.nrostatic.com/sites/default/files/uploaded/donald-trump-video-shows-his-obsession-celebrity-not-just-sexism.jpg",
      "twitter:title": "Bending to Trump’s Star Power, by Jonah Goldberg, National Review",
      "twitter:url": "http://www.nationalreview.com/article/440969/donald-trump-video-shows-his-obsession-celebrity-not-just-sexism",
      "twitter:card": "summary",
      "copyright": "© National Review, Inc.",
      "news_keywords": "Jonah Goldberg, Politics, Nation, World",
      "sailthru.date": "Wed, 2016-10-12 00:00"
     }
    ],
    "cse_image": [
     {
      "src": "http://c5.nrostatic.com/sites/default/files/uploaded/donald-trump-video-shows-his-obsession-celebrity-not-just-sexism-r.jpg"
     }
    ],
    "article": [
     {
      "headline": "Bending to Trump’s Star Power",
      "name": "Bending to Trump’s Star Power",
      "image": "http://c1.nrostatic.com/sites/default/files/styles/original_image_with_cropping/public/uploaded/donald-trump-video-shows-his-obsession-celebrity-not-just-sexism.jpg?itok=86zmv60o",
      "author": "Jonah Goldberg",
      "datemodified": "2016-10-12T15:26:14-04:00",
      "mainentityofpage": "http://www.nationalreview.com/article/440969/donald-trump-video-shows-his-obsession-celebrity-not-just-sexism",
      "datepublished": "2016-10-12T00:00:00-04:00",
      "description": "Trump cares about his celebrity status above all, and Republicans have shown themselves too susceptible to its pull.",
      "articlebody": "‘You can do anything. Grab them by the [genitals]. You can do anything.” That was Donald Trump explaining to Billy Bush of Access Hollywood what it’s like “when you’re a star” in..."
     }
    ]
   }
  },
  {
   "kind": "customsearch#result",
   "title": "Donald Trump's Election Repudiates Elites Who Ignored Americans ...",
   "htmlTitle": "Donald <b>Trump&#39;s</b> Election Repudiates Elites Who Ignored Americans ...",
   "link": "http://www.nationalreview.com/article/442049/donald-trumps-election-repudiates-elites-who-ignored-americans-beyond-beltway",
   "displayLink": "www.nationalreview.com",
   "snippet": "Nov 10, 2016 ... Leveraging rich people for favors and money seems an obsession. ... One big \nloser is the Obama Justice Department — or rather the very ...",
   "htmlSnippet": "Nov 10, 2016 <b>...</b> Leveraging rich people for favors and money seems an <b>obsession</b>. ... One big <br>\nloser is the <b>Obama</b> Justice Department — or rather the very&nbsp;...",
   "cacheId": "W9bzD2oCf5AJ",
   "formattedUrl": "www.nationalreview.com/.../donald-trumps-election-repudiates-elites-who- ignored-americans-beyond-beltway",
   "htmlFormattedUrl": "www.nationalreview.com/.../donald-<b>trumps</b>-election-repudiates-elites-who- ignored-americans-beyond-beltway",
   "pagemap": {
    "cse_thumbnail": [
     {
      "width": "225",
      "height": "225",
      "src": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQHBfczDu33OZ3x6u-veVPsqf0v9UwpkllbhH01rhzkJ92NkciI-dGCCUw"
     }
    ],
    "imageobject": [
     {
      "url": "http://c8.nrostatic.com/sites/all/themes/nro_javelin/assets/img/logo-print.jpg",
      "width": "600",
      "height": "60"
     }
    ],
    "organization": [
     {
      "name": "National Review"
     }
    ],
    "metatags": [
     {
      "msvalidate.01": "E48498F585100158A880ED1615918208",
      "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      "fb:pages": "15779440092",
      "title": "Donald Trump’s Election Repudiates Elites Who Ignored Americans Beyond the Beltway | National Review",
      "twitter:description": "Biased and incompetent elites polluted the 2016 election between Donald Trump and Hillary Clinton, and they are getting what they deserved.",
      "og:description": "Biased and incompetent elites polluted the 2016 election between Donald Trump and Hillary Clinton, and they are getting what they deserved.",
      "sailthru.tags": "politics, donald-trump, voters, income-inequality, 2016, article, long",
      "tweettext": "Biased and incompetent elites polluted the 2016 election between Donald Trump and Hillary Clinton, and they are getting what they deserved.",
      "og:url": "http://www.nationalreview.com/article/442049/donald-trumps-election-repudiates-elites-who-ignored-americans-beyond-beltway",
      "og:type": "article",
      "og:site_name": "National Review",
      "fb:app_id": "129250807108374",
      "sailthru.title": "A Blow to the Non-Elite Elite",
      "sailthru.author": "Victor Davis Hanson",
      "og:image": "http://c1.nrostatic.com/sites/default/files/uploaded/donald-trumps-election-repudiates-elites-who-ignored-americans-beyond-beltway-r.jpg",
      "og:title": "A Blow to the Non-Elite Elite",
      "twitter:image": "http://c5.nrostatic.com/sites/default/files/uploaded/donald-trumps-election-repudiates-elites-who-ignored-americans-beyond-beltway.jpg",
      "twitter:title": "A Blow to the Non-Elite Elite, by Victor Davis Hanson, National Review",
      "twitter:url": "http://www.nationalreview.com/article/442049/donald-trumps-election-repudiates-elites-who-ignored-americans-beyond-beltway",
      "twitter:card": "summary",
      "copyright": "© National Review, Inc.",
      "news_keywords": "Victor Davis Hanson, Politics, Nation, World",
      "sailthru.date": "Thu, 2016-11-10 00:00"
     }
    ],
    "cse_image": [
     {
      "src": "http://c1.nrostatic.com/sites/default/files/uploaded/donald-trumps-election-repudiates-elites-who-ignored-americans-beyond-beltway-r.jpg"
     }
    ],
    "article": [
     {
      "headline": "A Blow to the Non-Elite Elite",
      "name": "A Blow to the Non-Elite Elite",
      "image": "http://c5.nrostatic.com/sites/default/files/styles/original_image_with_cropping/public/uploaded/donald-trumps-election-repudiates-elites-who-ignored-americans-beyond-beltway.jpg?itok=aur3vMSl",
      "author": "Victor Davis Hanson",
      "datemodified": "2016-11-10T14:16:55-05:00",
      "mainentityofpage": "http://www.nationalreview.com/article/442049/donald-trumps-election-repudiates-elites-who-ignored-americans-beyond-beltway",
      "datepublished": "2016-11-10T00:00:00-05:00",
      "description": "Biased and incompetent elites polluted the 2016 election, and they are getting what they deserved.",
      "articlebody": "There were a lot of losers in this election, well beyond Hillary Clinton and the smug, incompetent pollsters and know-it-all, groupthink pundits who embarrassed themselves. From hacked e-mail..."
     }
    ]
   }
  }
 ]
}
