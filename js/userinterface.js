/*
 * userinterface.js - provide skin / input mechanism
 */
var ViewManager = function() {
  var current_skin;
  var current_skin_name;
  var viewtask_timer = null;
  var viewtask = null;
  var authorization = false;
  
  var FLYOUT = { NONE: 0, TWIT: 1, UPDATE: 2};
  var flyout_type = FLYOUT.NONE; // FLYOUT
  
  var VIEW = {TIMELINE: 1, REPLY: 2, DM: 3};
  var view_type = VIEW.TIMELINE; // VIEW
  
  var ViewTask = function () {
    this.requestQueue = new Array();
    this.busy = false;
  };
  
  ViewTask.prototype.idle = function() {
    if(viewtask_timer) {
      clearTimeout(viewtask_timer);
    }
    viewtask_timer = setTimeout(function() { viewtask.idle(); }, 200);
    if(this.requestQueue.length == 0) return;
    if(this.busy) return;
    this.busy = true;
    var method = this.requestQueue.shift();
    method();
  }
  
  ViewTask.prototype.push = function(task) {
    this.requestQueue.push(task);
    this.idle();
  }
  
  ViewTask.prototype.finish = function() {
    this.busy = false;
  }
  
  return {
    /**
     * event handler on dock state changed
     */
    dockStateChanged : function() {
      var settings = Twigadge.userSettings;
      if(System.Gadget.docked) {
        settings.width = System.Gadget.Settings.read('docked_width');
        if (!settings.width) settings.width = 130;
        if (settings.width < 130) settings.width = 130;
        settings.height = System.Gadget.Settings.read('docked_height');
        if (!settings.height) settings.height = 200;
        if (settings.height < 60) settings.height = 60;
      } else {
        settings.width = System.Gadget.Settings.read('undocked_width');
        if (!settings.width) settings.width = 280;
        if (settings.width < 130) settings.width = 130;
        settings.height = System.Gadget.Settings.read('undocked_height');
        if (!settings.height) settings.height = 350;
        if (settings.height < 60) settings.height = 60;
      }
      view_type = VIEW.TIMELINE;
      Twigadge.refresh();
    },
    
    // ---- skin management ----
    loadSkin: function(skin_name) {
      current_skin_name = skin_name;
      $("#main_css").attr('href', '../skin/' + skin_name + '/style.css');
      var jsname = '../skin/' + skin_name + '/skin.js';
      var scr = document.getElementsByTagName('script');    
      if(scr.size > 0) {
        for(var i in scr) {
          document.removeChild(scr[i]);
        }
      }
      
      var s = document.createElement('script');
      s.src = jsname;
      s.type = 'text/javascript';
      s.charset = 'utf-8';
      document.body.appendChild(s);
      $("body").css("height", Twigadge.userSettings.height);
      current_skin = new Skin();
      current_skin.initializeHeader();
      current_skin.initializeMain();
      current_skin.initializeFooter();
      viewtask = new ViewTask();
      viewtask.idle();
    },
    
    getSkinFolder: function() {
      return './skin/' + current_skin_name;
    },
    // ---- From skin ----
    /**
     * request to reload timeline.
     */
    reload: function() {
      viewtask.push(function() { 
        Twigadge.getFriendTL(); 
        viewtask.finish(); 
      });
    },
    
    /**
     * show update flyout with reply id 
     */
    replyTo: function(id) {
      viewtask.push(function() { 
        twit = Twigadge.getTwit(id);
        if(twit != null) {
          if(System.Gadget.Flyout.show && (flyout_type == FLYOUT.UPDATE)) {
            current_skin.updateReplyTarget(twit.user.screen_name);
          } else {
            setTimeout(function() { ViewManager.showUpdateFlyout('@' + twit.user.screen_name + ' ', twit); }, 100);
          }
        } 
        viewtask.finish();
      });
    },
    
    /**
     * show update flyout with DM reply format
     * @param[in] (string)name
     */
    dmReplyTo: function(name) {
      viewtask.push(function() { 
        setTimeout(function() { ViewManager.showUpdateFlyout('d ' + name + ' '); }, 100);
        viewtask.finish();
      });
    },
    
    /**
     * Authorize using PIN
     * @param[in] (string)pin
     */
    authorize: function(pin) {
      viewtask.push(function() {
        if(!this.authorization) {
          this.authorization = true;
          current_skin.showLoading();
          Twigadge.authorize(pin);
        }
        viewtask.finish();
      });
    },
    
    /**
     * favorite tweet
     * @param[in] (int)id - id of the tweet
     */
    favorite: function(id) {
      viewtask.push(function() {
        setTimeout(function() { Twigadge.favorite(id); }, 1);
        viewtask.finish();
      });
    },
    
    /**
     * unfavorite tweet
     * @param[in] (int)id - id of the tweet
     */
    unfavorite: function(id) {
      viewtask.push(function() {
        setTimeout(function() { Twigadge.unfavorite(id); }, 1);
        viewtask.finish();
      });
    },
    
    /**
     * show update flyout with retweet text
     * @param[in] (int)id - id of the tweet
     */
    retweet: function(id) {
      viewtask.push(function() { 
        twit = Twigadge.getTwit(id);
        if(twit != null) {
          setTimeout(function() { ViewManager.showUpdateFlyout('RT @' + twit.user.screen_name + ': ' + twit.text); }, 100);
        } 
        viewtask.finish();
      });
    },
    
    /**
     * change main view to home timeline
     */
    changeViewToTL: function() {
      viewtask.push(function() { 
        if(view_type != VIEW.TIMELINE) {
          Twigadge.getFriendTL();
          view_type = VIEW.TIMELINE;
        }
        viewtask.finish();
      });
    },
    
    /**
     * change main view to mentions timeline
     */
    changeViewToReply: function() {
      viewtask.push(function() { 
        if(view_type != VIEW.REPLY) {
          Twigadge.getMentions();
          view_type = VIEW.REPLY;
        }
        viewtask.finish();
      });
    },
    
    /**
     * change main view to direct messages
     */
    changeViewToDM: function() {
      viewtask.push(function() { 
        if(view_type != VIEW.DM) {
          Twigadge.getDM();
          view_type = VIEW.DM;
        }
        viewtask.finish();
      });
    },
    
    // ---- To skin ----
    updateFriendsTimeline: function(queue) {
      viewtask.push(function() { 
        current_skin.renderFriendsTimeline(queue);
        var settings = Twigadge.userSettings;
        if(settings.autoScroll) {
          setTimeout(function() { ViewManager.rewindToTop(); }, 100);
        }
        viewtask.finish(); 
      });
    },
    
    updateDM: function(queue) {
      viewtask.push(function() { 
        current_skin.renderDM(queue); 
        var settings = Twigadge.userSettings;
        if(settings.autoScroll) {
          setTimeout(function() { ViewManager.rewindToTop(); }, 100);
        }
        viewtask.finish(); 
      });
    },
    
    updateSystemMessage: function(queue) {
      viewtask.push(function() { 
        current_skin.renderSystemMessage(queue); 
        var settings = Twigadge.userSettings;
        if(settings.autoScroll) {
          setTimeout(function() { ViewManager.rewindToTop(); }, 100);
        }
        viewtask.finish(); 
      });
    },
    
    /**
     * show update flyout.
     * @param[in] (string)text - default text.
     * @param[in] (tweet)target_tweet - the target tweet for reply
     */
    showUpdateFlyout: function(text, target_tweet) {
      viewtask.push(function() { 
        // if not authorized, do nothing.
        var settings = Twigadge.userSettings;
        if(settings.atoken == '' || settings.atoken_secret == '') {
          viewtask.finish();
          return;
        }
        if(System.Gadget.Flyout.show) {
          System.Gadget.Flyout.show = false;
          setTimeout(function() { current_skin.showUpdateFlyout(text, target_tweet); flyout_type = FLYOUT.UPDATE; viewtask.finish(); }, 500);
        } else {
          current_skin.showUpdateFlyout(text, target_tweet); 
          flyout_type = FLYOUT.UPDATE;
          viewtask.finish(); 
        }
      });
      
    },
    
    /**
     * show the progress of connection
     * @param[in] (Twigadge.CONNECT)connection - the type of the connection
     * @param[in] (boolean)finished - the connection is finished or not
     */
    showProgress: function(connection, finished) {
      viewtask.push(function() { 
        switch(connection) {
        case Twigadge.CONNECT.AUTH:
          current_skin.showConnectionOfFriendTL(finished);
          break;
        case Twigadge.CONNECT.FRIEND_TL:
          current_skin.showConnectionOfFriendTL(finished);
          break;
        case Twigadge.CONNECT.POST_TL:
          current_skin.showConnectionOfPostTL(finished);
          break;
        case Twigadge.CONNECT.ERROR:
          current_skin.showConnectionError();
          break;
        }
        viewtask.finish(); 
      });
    },
    
    /**
     * show the twit of id on the flyout
     * @param[in] (int)id - id of the twit
     */
    showTwitFlyout: function(id) {
      viewtask.push(function() { 
        twit = Twigadge.getTwit(id);
        if(twit != null) {
          if(System.Gadget.Flyout.show) {
            System.Gadget.Flyout.show = false;
            setTimeout(function() { current_skin.showTwitFlyout(twit); flyout_type = FLYOUT.TWIT; viewtask.finish(); }, 500);
          } else {
            current_skin.showTwitFlyout(twit);
            flyout_type = FLYOUT.TWIT;
            viewtask.finish();
          }
        } else {
          viewtask.finish();
        }
      });
    },
    
    /**
     * update favorite status in twit flyout
     * @param[in] (Twigadge.FAVORITE)fav - favorite status
     */
    updateFavStatusInTwitFlyout: function(fav) {
      viewtask.push(function() {
        setTimeout(function() { current_skin.updateFavStatusInTwitFlyout(fav); }, 1);
        viewtask.finish();
      });
    },
    
    /**
     * show oauth authorization window
     * @param[in] (string)oauth_token - for accessing authorization page.
     * @param[in] (string)errorMsg - error message.
     */
    showOAuthAuthorization: function(oauth_token, errorMsg) {
      viewtask.push(function() { 
        this.authorization = false;
        current_skin.showOAuthAuthorization(oauth_token, errorMsg);
        viewtask.finish(); 
      });
    },
    
    /**
     * rewind scroll bar to top
     */
    rewindToTop: function(){
      viewtask.push(function() { 
        current_skin.scroll(true);
        viewtask.finish(); 
      });
    },
    
    dummy: function() {}
  };
}();

