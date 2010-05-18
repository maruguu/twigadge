/*
 * buzztter.js - get buzzwords from Buzztter
 */

var Buzztter = function() {
  var settings = null;
  var refreshTimer = null;
  var buzzwords = [];
  
  /**
   * Perse XML document
   * @param[in] xmlText - XML document to be persed
   * @return DOM object
   */
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
  
  /**
   * Sort by length
   * @param[in] a - input word
   * @param[in] b - input word
   * @return true if b is longer than a
   *         false if b is NOT longer than a
   */
  var sortFunction = function(a, b) {
    var al = a.length;
    var bl = b.length;
    return al < bl;
  }
  
  /**
   * Get Buzztter feed
   */
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
        //Twigadge.output(Twigadge.DEBUG_LEVEL.info, Local.getBuzztterFinished);
      } else if(xhr && xhr.readyState == 4) {
       //Twigadge.output(Twigadge.DEBUG_LEVEL.error, "Buzztter:" + xhr.status + ':' + xhr.statusText);
      } else if(xhr && istimeout == 'timeout') {
        //Twigadge.output(Twigadge.DEBUG_LEVEL.error, Local.getBuzztterTimeout);
      } else if(xhr && xhr.readyState == 3) {
        //Twigadge.output(Twigadge.DEBUG_LEVEL.info, Local.getBuzztterFeed2);
      } else {
      }
    }
    xhr.send('');
    //Twigadge.output(Twigadge.DEBUG_LEVEL.info, Local.getBuzztterFeed);
  };
  
  /**
   * Refresh Buzztter feed internally
   */
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
  
  /**
   * Highlight and link one buzzword
   * @param[in] txt - text to be replaced
   * @param[in] word - bazzword to replace
   * @return highlighted and linked text
   */  
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
    /**
     * Refresh Buzztter feed
     * @param[in] s - settings
     */
    refresh: function(s) {
      settings = s;
      if(refreshTimer) {
        clearTimeout(refreshTimer);
      }
      refreshTimer = setTimeout(function() { refreshFeed(); }, 100);
    },
    
    /**
     * Stop to refresh Buzztter feed
     */
    stop: function() {
      if(refreshTimer) {
        clearTimeout(refreshTimer);
      }
    },
    
    /**
     * Highlight and link buzzwords
     * @param[in] txt - text to be replaced
     * @return highlighted and linked text
     */
    replace: function(txt) {
      for(var i = 1; i < buzzwords.length; i++) {
        txt = replaceBuzzword(txt, buzzwords[i]);
      }
      return txt;
    }
  };
}();

