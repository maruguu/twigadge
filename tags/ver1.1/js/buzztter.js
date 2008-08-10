/*
 * buzztter.js - get buzzwords from Buzztter
 */

var Buzztter = function() {
  var settings = null;
  var refreshTimer = null;
  var buzzwords = [];
  
  var parseXml = function(xmlText) {
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
  };
  
  var sortFunction = function(a, b) {
    var al = a.length;
    var bl = b.length;
    return al < bl;
  }
  
  var getBuzztterFeed = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', Local.buzztterUrl + "rss", true);
    xhr.setRequestHeader('If-Modified-Since', "Sat, 1 Jan 2000 00:00:00 GMT");
    xhr.setRequestHeader('Content-Type', 'application/xml');
    
    xhr.onreadystatechange = function(istimeout) {
      if(xhr && xhr.readyState == 4 && xhr.status == 200) {
        var xml = parseXml(xhr.responseText);
        var itemList = xml.getElementsByTagName("item");
        buzzwords = [];
        for(var i = 0; i < itemList.length; i++) {
          buzzwords.push(itemList[i].getElementsByTagName("title")[0].childNodes[0].nodeValue);
        }
        buzzwords.sort(sortFunction);
        Twigadge.output(Twigadge.DEBUG_LEVEL.info, Local.getBuzztterFinished);
        
      } else if(xhr && xhr.readyState == 4) {
       Twigadge.output(Twigadge.DEBUG_LEVEL.error, "Buzztter:" + xhr.status + ':' + xhr.statusText);
      } else if(xhr && istimeout == 'timeout') {
        Twigadge.output(Twigadge.DEBUG_LEVEL.error, Local.getBuzztterTimeout);
      } else if(xhr && xhr.readyState == 3) {
        Twigadge.output(Twigadge.DEBUG_LEVEL.info, Local.getBuzztterFeed2);
      } else {
      }
    }
    xhr.send('');
    Twigadge.output(Twigadge.DEBUG_LEVEL.info, Local.getBuzztterFeed);
  };
  
  var refreshFeed = function() {
    if(settings == null) return ;
    if(settings.buzztter.enable) {
      if(refreshTimer) {
        clearTimeout(refreshTimer);
      }
      getBuzztterFeed();
      refreshTimer = setTimeout(function() { refreshFeed(); }, 
                         1000 * 60 * settings.buzztter.interval);
    }
  };
  
  var replaceBuzzword = function(txt, word) {
    var reg = /<a (class="buzzword" )?href="[^>]+">[^<]*<\/a>/gmi;
    var output = [];
    var buzztterUrl = '<a class="buzzword" href="' + Local.buzztterUrl + 'k/' + encodeURI(word) + '\">' + word + '</a>';
    var i = 0;
    var m;
    while(m = reg.exec(txt)) {
      output.push(txt.substring(i, m.index).replace(word, buzztterUrl));
      output.push(txt.substring(m.index, m.index + m[0].length));
      i= m.index + m[0].length;
    }
    output.push(txt.substring(i, txt.length).replace(word, buzztterUrl));
    return output.join('');
  };

  // ---------------- public ----------------
  return {
    refresh: function(s) {
      settings = s;
      if(refreshTimer) {
        clearTimeout(refreshTimer);
      }
      refreshTimer = setTimeout(function() { refreshFeed(); }, 100);
    },
    
    stop: function() {
      if(refreshTimer) {
        clearTimeout(refreshTimer);
      }
    },
    
    replace: function(txt) {
      for(var i = 1; i < buzzwords.length; i++) {
        txt = replaceBuzzword(txt, buzzwords[i]);
      }
      return txt;
    }
  };
}();
