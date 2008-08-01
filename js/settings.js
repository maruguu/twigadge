/*
 *  settings.js
 */
var Settings = function(){
  var settings;
  var previous_page;

  /**
   * store settings in the page
   */
  var store = function(page) {
    if(page == 0) {
      settings.username = $('user').value;
      settings.password = $('pass').value;
      settings.interval = $('interval').value;
      //settings.intervalDM = $('intervalDM').value;
      settings.getReplyFirst = $('reply').checked;
      settings.usePOSTMethod = $('post').checked;
    } else if(page == 1) {
      settings.width = $('width').value;
      settings.height = $('height').value;
      settings.autoScroll = $('scroller').checked;
      settings.fixedBlock = $('fixed').checked;
      settings.enableHeart = $('heart').checked;
    } else if(page == 2) {
      settings.buzztter.enable = $('buzz_enable').checked;
      settings.buzztter.interval = $('buzz_interval').value;
      settings.queueSize = $('queueSize').value;
    } else if(page == 3) {
      settings.checkVersion = $('check_ver').checked;
    }
  };

  return {
    /**
     * init setting window
     */
    init: function() {
      window.detachEvent('onload', Settings.init);
      System.Gadget.onSettingsClosing = Settings.closing;
      
      settings = Twigadge.userSettings;
      settings.read();
      previous_page = 0;
      Settings.showTab(0);
    },
    
    /**
     * event handler on closing settings window
     */
    closing: function(event) {
      if(event.closeAction == event.Action.commit) {
        store(previous_page);
        settings.write();
      }
    },
    
    /**
     * show each tab
     */
    showTab: function(page) {
      var content = (page < 0) ? "" : pages[page];
      
      // Save settings
      if(previous_page != page) {
        store(previous_page);
      }
      // render menu
      $('menu').innerHTML = "";
      for(var i = 0; i < menu.length; i++) {
        var m = menu[i];
        if(i == page) {
          m = m.replace("tab", "current_tab");
        }
        $('menu').innerHTML += m;
        if(i < menu.length - 1) {
          $('menu').innerHTML += " | ";
        }
      }
      
      // content
      $('content').innerHTML = content;
      
      if(page == 0) {
        $('user').value = settings.username;
        $('pass').value = settings.password;
        $('interval').value = settings.interval;
        //$('intervalDM').value = settings.intervalDM;
        $('reply').checked = settings.getReplyFirst;
        $('post').checked = settings.usePOSTMethod;
      } else if(page == 1) {
        $('width').value = settings.width;
        $('height').value = settings.height;
        $('scroller').checked = settings.autoScroll;
        $('fixed').checked = settings.fixedBlock;
        $('heart').checked = settings.enableHeart;
      } else if(page == 2) {
        $('buzz_enable').checked = settings.buzztter.enable;
        $('buzz_interval').value = settings.buzztter.interval;
        $('queueSize').value = settings.queueSize;
      } else if(page == 3) {
        $('check_ver').checked = settings.checkVersion;
        $('version').innerHTML = 'Version ' + System.Gadget.version;
      }
      previous_page = page;
    }
    
  };
}();

window.attachEvent('onload', Settings.init);
