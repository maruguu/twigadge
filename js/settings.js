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
      settings.interval = $('#interval').val();
    } else if(page == 1) {
      settings.width = $('#width').val();
      settings.height = $('#height').val();
      settings.autoScroll = $('#scroller').attr('checked');
      settings.fixedBlock = $('#fixed').attr('checked');
      settings.skinName = $('#skin_list').val();
    } else if(page == 2) {
      settings.buzztter.enable = $('#buzz_enable').attr('checked');
      settings.buzztter.interval = $('#buzz_interval').val();
      settings.queueSize = $('#queueSize').val();
    } else if(page == 3) {
      settings.checkVersion = $('#check_ver').attr('checked');
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
      $('#menu').empty();
      for(var i = 0; i < menu.length; i++) {
        var m = menu[i];
        if(i == page) {
          m = m.replace("tab", "current_tab");
        }
        $('#menu').append(m);
        if(i < menu.length - 1) {
          $('#menu').append(" | ");
        }
      }
      
      // content
      $('#content').empty();
      $('#content').append(content);
      
      if(page == 0) {
        if(settings.screen_name != '') {
          $('#authorization').text(LocalSettings.authStatus + settings.screen_name);
        } else {
          $('#authorization').text(LocalSettings.notAuthorized);
        }
        $('#interval').val(settings.interval);
      } else if(page == 1) {
        $('#width').val(settings.width);
        $('#height').val(settings.height);
        $('#scroller').attr('checked', settings.autoScroll);
        $('#fixed').attr('checked', settings.fixedBlock);
        var s = settings.skinName;
        $('option').each(function() {
          if(s == $(this).val()) {
            $('#skin_list').val(s);
          }
        });
        
      } else if(page == 2) {
        $('#buzz_enable').attr('checked', settings.buzztter.enable);
        $('#buzz_interval').val(settings.buzztter.interval);
        $('#queueSize').val(settings.queueSize);
      } else if(page == 3) {
        $('#check_ver').attr('checked', settings.checkVersion);
        $('#version').text('Version ' + System.Gadget.version);
      }
      previous_page = page;
    }
    
  };
}();

window.attachEvent('onload', Settings.init);
