/*
 * gadget.js - entry point for sidebar gadget
 */

var Gadget = function() {
//-----------------------------------------------------------------------------
// Private variables
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Private methods
//-----------------------------------------------------------------------------

  var init = function() {
    var settings = Twigadge.userSettings;
    settings.read();
    if(settings.buzztter.enable) {
      Buzztter.refresh(settings);
    } else {
      Buzztter.stop();
    }
    
    Twigadge.getFriendTL();
  };
  
  // Check the latest version of gadget
  var checkLatestVersion = function() {
    var url = "http://code.google.com/p/twigadge/wiki/ChangeLog";
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('If-Modified-Since', "Sat, 1 Jan 2000 00:00:00 GMT");
    xhr.onreadystatechange = function(istimeout) {
      if(xhr && xhr.readyState == 4 && xhr.status == 200) {
        // Need major and minor version in ChangeLog
        if(xhr.responseText.match(/Version\s(\d\.\d(\.\d)?(\.\d)?)/) != null) {
          var latest = RegExp.$1;
          var latest_version = latest;
          var ver = System.Gadget.version;
          while(latest.match(/(\d)/) != null) {
            n = RegExp.$1;
            latest = RegExp.rightContext;
            if(ver.match(/(\d)/) == null) {
              confirmToOpenWeb(latest_version);
              break;
            }
            m = RegExp.$1;
            ver = RegExp.rightContext;
            if(n > m) {
              confirmToOpenWeb(latest_version);
              break;
            } else if (n < m){
              break;
            }
          } 
        }
      } 
    };
    xhr.send('');
  };
  
  var confirmToOpenWeb = function(latest_version) {
    var txt = Local.gotoDLPage;
    txt = txt.replace(/%%GADGET_VERSION%%/, System.Gadget.version);
    txt = txt.replace(/%%LATEST_VERSION%%/, latest_version);
    if(confirm(txt)) {
      open("http://code.google.com/p/twigadge/");
    }
  };
  
  
  return {
  
//-----------------------------------------------------------------------------
// Public methods
//-----------------------------------------------------------------------------

    settingsClosed: function(p_event) {
      if (p_event.closeAction == p_event.Action.commit) {
        init();
      }
    },
    
    pageLoad: function() {
      System.Gadget.settingsUI = 'settings.html';
      System.Gadget.onSettingsClosed = Gadget.settingsClosed;
      System.Gadget.onDock = ViewManager.dockStateChanged;
      System.Gadget.onUndock = ViewManager.dockStateChanged;
      
      var settings = Twigadge.userSettings;
      settings.read();
      if(settings.checkVersion) {
        checkLatestVersion();
      }
      init();
      
    }
  };
}();
