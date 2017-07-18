// BTM Tracking ID
 var _TrackingID = 'UA-100825621-1';

 var buttonClickEventDescription = "Show Alternatives Clicks on ";

 var outBoundLinkEventDescription = "Outbound Link from ";

 var hitType = "event";

 var eventAction = "click";

// Include Javascript Tracking Snippet
 (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://ssl.google-analytics.com/analytics.js','ga');

// Create Google Analytics Tracker
ga('create', _TrackingID, 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('send', 'pageview', '/options.html');
/**
  Add Listener that handles incoming the following events:
  1) Show Alternatives Click - Register click to GA when Show Alternatives Button is selected
  2) Outbound Link Click - Register click when GA when user clicks on a recommendation link
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type === "Show Alternatives Click") {
      ga('send', {
        hitType: hitType,
        eventCategory: buttonClickEventDescription.concat(request.source),
        eventAction: eventAction
      });
    }

    else if(request.type === "BTM Icon Click") {
      ga('send', {
        hitType: hitType,
        eventCategory: buttonClickEventDescription.concat(request.source),
        eventAction: eventAction
      });
    }

    else if(request.type === "Outbound Link Click") {
      ga('send', {
        hitType: hitType,
        eventCategory: outBoundLinkEventDescription.concat(request.source),
        eventAction: eventAction,
        eventLabel: request.originUrl + " : " +  request.targetUrl,
        eventValue: request.elapsedTime
      });
    }
    else {}
    sendResponse(request);
});
