document.addEventListener('DOMContentLoaded', function() {
  console.log('loaded');
  var searchUrl ='https://www.googleapis.com/customsearch/v1?q=trumps-plan&cx=013013877924597244999%3Atbq0ixuctim&key=AIzaSyBS3sgS67eZkQRC_A7LZZG82AFeyBt8FW8';
  x = new XMLHttpRequest();

  x.open('GET', searchUrl);
  x.responseType = 'json';
  x.onload = function () {
  	console.log(x.response.items);
  	return;
  }
  x.onerror = function() {
  	console.error('request error');
  }
  x.send();
//   x.responseType = 'json';
//   x.onload = function() {
//     // Parse and process the response from Google Image Search.
//     var response = x.response;
//     if (!response || !response.responseData || !response.responseData.results ||
//         response.responseData.results.length === 0) {
//       errorCallback('No response from Google Image search!');
//       return;
//     }
//     var firstResult = response.responseData.results[0];
//     // Take the thumbnail instead of the full image to get an approximately
//     // consistent image size.
//     var imageUrl = firstResult.tbUrl;
//     var width = parseInt(firstResult.tbWidth);
//     var height = parseInt(firstResult.tbHeight);
//     console.assert(
//         typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
//         'Unexpected respose from the Google Image Search API!');
//     callback(imageUrl, width, height);
//   };
//   x.onerror = function() {
//     errorCallback('Network error.');
//   };
//   x.send();
});