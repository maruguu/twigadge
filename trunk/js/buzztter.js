// buzztter.js
// Get buzztter rss feed ...
// TXT -> DOM(http://d.hatena.ne.jp/bellbind/20051003/p5)
var Buzztter = {
  BuzzDict: [],
  refreshTimer: null
};

function parseXml(xmlText) {
  if (window.ActiveXObject) {
    var domDoc = new ActiveXObject('Microsoft.XMLDOM');
    domDoc.async = false;
    domDoc.loadXML(xmlText);
    return domDoc;
  } else if(window.DOMParser) {
    var domParser = new DOMParser();
    return domParser.parseFromString(xmlText, "application/xml");
  } else {
    return null;
  }
}

function sortFunc(a, b) {
  var al = a.length;
  var bl = b.length;
  return al < bl;
}

function getFeed() {
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open('GET', LOCAL.feed_url, true);
  xhr.setRequestHeader('If-Modified-Since', "Sat, 1 Jan 2000 00:00:00 GMT");
  xhr.setRequestHeader('Content-Type', 'application/xml');

  xhr.onreadystatechange = function(istimeout) {
    if(xhr && xhr.readyState == 4 && xhr.status == 200) {
      var xml = parseXml(xhr.responseText);
      var itemList =  xml.getElementsByTagName("item");
      Buzztter.BuzzDict = new Array();
      for(var i = 0; i < itemList.length; i++) {
        Buzztter.BuzzDict.push(itemList[i].getElementsByTagName("title")[0].childNodes[0].nodeValue);
      }
      Buzztter.BuzzDict.sort(sortFunc);
      
      $('output').innerHTML = LOCAL.get_feed_success;
    } else if(xhr && xhr.readyState == 4) {
      $('output').innerHTML = "Buzztter:" + xhr.status + ':' + xhr.statusText;
    } else if(xhr && istimeout == 'timeout') {
      $('output').innerHTML = LOCAL.get_feed_error;
    } else if(xhr && xhr.readyState == 3) {
      $('output').innerHTML = LOCAL.get_feed_progress;
    } else {
    }
  };
  xhr.send('');
  $('output').innerHTML = LOCAL.get_feed_start;
}

function refreshFeed(us) {
  if(us.buzztter.enable) {
    if(Buzztter.refreshTimer) {
      window.clearTimeout(Buzztter.refreshTimer);
    }
    getFeed();
    Buzztter.refreshTimer = setTimeout(function() { refreshFeed(us); }, 1000 * 60 * us.buzztter.interval);
  }
}

function replaceBuzzword(txt, word) {
  var reg = /<a (class="buzzword" )?href="[^>]+">[^<]*<\/a>/gmi;
  var output = [], m, i=0;
  var buzz_url = '<a class="buzzword" href="http://buzztter.com/ja/k/' + encodeURI(word) + '\">' + word + '</a>';
  while(m = reg.exec(txt)) {
    output.push(txt.substring(i, m.index).replace(word, buzz_url));
    output.push(txt.substring(m.index, m.index + m[0].length));
    i= m.index + m[0].length;
  }
  output.push(txt.substring(i, txt.length).replace(word, buzz_url));
  return output.join('');
}

function BuzzHighlight(txt) {
  for(var i = 1; i < Buzztter.BuzzDict.length; i++) {
    txt = replaceBuzzword(txt, Buzztter.BuzzDict[i]);
  }
  return txt;
}
