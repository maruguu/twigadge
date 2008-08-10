/*
 * twigadge.js - 
 *   
 */

var Twigadge = function() {
  var renderMode = 0;
  var MODES = { timeline: 0, dm: 1, reply: 2, system: 3};
  var Scroller = {y: 0, count: 0};
  var flyoutType;
  
  var Settings = function () {
    // connection tab
    this.username = '';
    this.password = '';
    this.interval = 5;
    this.intervalDM = 60;
    this.getReplyFirst = true;
    this.usePOSTMethod = true;
    // view tab
    this.width = 130;
    this.height = 200;
    this.autoScroll = true;
    this.fixedBlock = false;
    this.enableHeart = true;
    // etc tab
    this.buzztter = {};
    this.buzztter.enable = true;
    this.buzztter.interval = 15;
    this.queueSize = 100;
    // version tab
    this.checkVersion = true;
  };
  
  Settings.prototype.read = function() {
    // connection tab
    this.username = System.Gadget.Settings.read('username');
    if (!this.username) username = '';
    this.password = System.Gadget.Settings.read('password');
    if (!this.password) this.password = '';
    this.interval = System.Gadget.Settings.read('interval');
    if (!this.interval || this.interval <= 0) this.interval = 5;
    this.intervalDM = System.Gadget.Settings.read('intervalDM');
    if (!this.intervalDM || this.intervalDM <= 0) this.intervalDM = 60;
    this.getReplyFirst = System.Gadget.Settings.read('getReplyFirst');
    this.usePOSTMethod = System.Gadget.Settings.read('usePOSTMethod');
    // view tab
    if(System.Gadget.docked) {
      this.width = System.Gadget.Settings.read('docked_width');
      if (!this.width || this.width < 20) this.width = 130;
      this.height = System.Gadget.Settings.read('docked_height');
      if (!this.height || this.height < 60) this.height = 200;
    } else {
      this.width = System.Gadget.Settings.read('undocked_width');
      if (!this.width || this.width < 20) this.width = 280;
      this.height = System.Gadget.Settings.read('undocked_height');
      if (!this.height || this.height < 60) this.height = 350;
    }
    this.autoScroll = System.Gadget.Settings.read('autoScroll');
    this.fixedBlock = System.Gadget.Settings.read('fixedBlock');
    this.enableHeart = System.Gadget.Settings.read('enableHeart');
    // etc tab
    this.buzztter.enable = System.Gadget.Settings.read('buzztter.enable');
    this.buzztter.interval = System.Gadget.Settings.read('buzztter.interval');
    if (!this.buzztter.interval || this.buzztter.interval <= 0) this.buzztter.interval = 30;
    this.queueSize = System.Gadget.Settings.read('queueSize');
    if (!this.queueSize || this.queueSize <= 0) this.queueSize = 100;
    // version tab
    this.checkVersion = System.Gadget.Settings.read('checkVersion');
  };
  
  Settings.prototype.write = function() {
    // connection tab
    System.Gadget.Settings.write('username', this.username);
    System.Gadget.Settings.write('password', this.password);
    this.writeInt('interval', this.interval, 5, 1, 3600);
    this.writeInt('intervalDM', this.intervalDM, 60, 1, 3600);
    System.Gadget.Settings.write('getReplyFirst', this.getReplyFirst);
    System.Gadget.Settings.write('usePOSTMethod', this.usePOSTMethod);
    // view tab
    if(System.Gadget.docked) {
      this.writeInt('docked_width', this.width, 130, 20, 10000);
      this.writeInt('docked_height', this.height, 200, 60, 10000);
    } else {
      this.writeInt('undocked_width', this.width, 280, 20, 10000);
      this.writeInt('undocked_height', this.height, 350, 60, 10000);
    }
    System.Gadget.Settings.write('autoScroll', this.autoScroll);
    System.Gadget.Settings.write('fixedBlock', this.fixedBlock);
    System.Gadget.Settings.write('enableHeart', this.enableHeart);
    // etc tab
    System.Gadget.Settings.write('buzztter.enable', this.buzztter.enable);
    this.writeInt('buzztter.interval', this.buzztter.interval, 5, 1, 3600);
    this.writeInt('queueSize', this.queueSize, 100, 20, 10000);
    // version tab
    System.Gadget.Settings.write('checkVersion', this.checkVersion);
    
  };
  
  /**
   * write integer value with checking range
   */
  Settings.prototype.writeInt = function(key, value, default_value, min, max) {
    var v = parseInt(value);
    if(isNaN(v) || v < min || v > max) v = default_value;
    System.Gadget.Settings.write(key, v);
  };
  
  var settings = new Settings();
  
  
  // return reply or not
  // if strict is true, only /^@username / is count as reply
  var isReply = function(username, twit, strict) {
    if(username != '') {
      if(strict && twit.text.indexOf('@' + username) == 0) {
        return true;
      } if(!strict && twit.text.indexOf('@' + username) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  };
  
  // get log icon
  var LOG_LEVEL = { error: 0, warning: 1, note: 2, info: 3};
  var getLogIcon = function(lv) {
    var path = '';
    switch(lv) {
    case LOG_LEVEL.error:
      path = 'images/log_error.png';
      break;
    case LOG_LEVEL.warning:
      path = 'images/log_warning.png';
      break;
    case LOG_LEVEL.note:
      path = 'images/log_note.png';
      break;
    case LOG_LEVEL.info:
      path = 'images/log_info.png';
      break;
    }
    return path;
  };
  
  /**
   * return stylesheet for fixed block
   */
  var fixedStyle = function() {
    if(settings.fixedBlock) {
      return 'style="height:42px; overflow:hidden;"';
    } else
      return '';
  };
  
  /**
   * return stylesheet for reply
   */
  var replyStyle = function(twit) {
    if(isReply(settings.username, twit, false)) {
      return 'bgcolor="#7acec8" ';
    } else {
      return '';
    }
  };
  
  var getTwitBlock = function(twit, no) {
    var width = (settings.width - 22);
    var img_width = (System.Gadget.docked) ? '20' : '48';
    
    var httpURL = /(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g;  //'
    var body = twit.text.replace(httpURL, '<a href="$1">$1</a>');
    
    // highlight buzzword (from buzztter)
    if(settings.buzztter.enable) {
      body = Buzztter.replace(body);
    }
    
    // convert <3 to heart
    if(settings.enableHeart) {
      body = body.replace(/&lt;3/g, '<img class="heart" src="images/heart.png" />');
    }
    
    var template = '<p class="block" id="block' + no + '" ' + fixedStyle() + '><table cellspacing="0" cellpadding="0"><tr><td width="' + width + '" ' + replyStyle(twit) + '><table class="user_image" background="' + twit.user.profile_image_url + '" width="' + img_width + '" height="48" align="left" onclick="Twigadge.showStatus(\'' + no + '\')"><tr><td></td></tr></table><b><div class="screen_name" id="screen_name' + no + '" onclick="Twigadge.reply(\'' + twit.user.screen_name + '\')" onmouseover="Twigadge.highlightScreenName(\'screen_name' + no + '\')" onmouseout="Twigadge.unhighlightScreenName(\'screen_name' + no + '\')">' + twit.user.screen_name +  '</div></b><div >' + body + '</div></td></tr></table></p>';
    return template;
  };
  
  // render timeline queue
  var queueTimeline = null;
  
  var renderTimeline = function() {
    if(queueTimeline == null) {
      $('main').innerHTML = '';
      return ;
    }
    var timeline = '';
    for(var i = 0; i < queueTimeline.length; i++) {
      timeline += getTwitBlock(queueTimeline[i], i);
    }
    $('main').innerHTML = timeline;
    
  };
  
  var renderReply = function() {
    if(queueTimeline == null) {
      $('main').innerHTML = '';
      return ;
    }
    icon_reply = false;
    refreshNotification();
    var timeline = '';
    for(var i = 0; i < queueTimeline.length; i++) {
      if(isReply(settings.username, queueTimeline[i], false)) {
        timeline += getTwitBlock(queueTimeline[i], i);
      }
    }
    $('main').innerHTML = timeline;
  };
  
  // queue to store direct messages
  var queueDirectMessage = null;
  
  /**
   * render direct message
   */
  var renderDirectMessage = function(queue) {
    // clear if queue is not found
    if(queueDirectMessage == null) {
      $('main').innerHTML = '';
      return ;
    }
    // reset notification icon
    icon_directmessage = false;
    refreshNotification();
    
    
    var width = (settings.width - 22);
    var img_width = (System.Gadget.docked) ? '20' : '48';
    
    var httpURL = /(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g;  //'
    var message = '';
    for(var i = 0; i < queueDirectMessage.length; i++) {
      var dm = queueDirectMessage[i];
      var body = dm.text.replace(httpURL, '<a href="$1">$1</a>');
    
      message += '<p class="block" ' + fixedStyle() + '><table cellspacing="0" cellpadding="0"><tr><td width="' + width + '"><table class="user_image" background="' + dm.sender.profile_image_url + '" width="' + img_width + '" height="48" align="left" onclick="Twigadge.showDirectMessage(\'' + i + '\')"><tr><td></td></tr></table><b><div class="screen_name" onclick="Twigadge.replyDM(\'' + dm.sender.screen_name + '\')">' + dm.sender.screen_name +  '</div></b><div >' + body + '</div></td></tr></table></p>';
    }
    $('main').innerHTML = message;
  };
  
  // render system message queue
  var queueSystemMessage = null;
  var renderSystemMessage = function(queue) {
    if(queueSystemMessage == null) return ;
    
    icon_error = false;
    refreshNotification();
    var message = '';
    for(var i = 0; i < queueSystemMessage.length; i++) {
      var output = '<p class="block"><table cellspacing="0" cellpadding="0"><tr><td><img src="' + getLogIcon(queueSystemMessage[i].level) + '" /></td><td>' + queueSystemMessage[i].message + '<br /><div class="time">' + getDiffTime(queueSystemMessage[i].time) + '</div></ td></tr></table></p>';
      
      message += output;
    }
    $('main').innerHTML = message;
  };
  
  // Notification
  var systemmessage_id = 0;
  var latest_directmessage_id = 0;
  var latest_reply_id = 0;
  var icon_directmessage = false;
  var icon_reply = false;
  var icon_error = false;
  var changeTimelineNotification = function() {
    if(queueTimeline == null) return;
    
    // get first reply twit's id in the queue
    var rep_id = 0;
    for(var i = 0; i < queueTimeline.length; i++) {
      if(isReply(settings.username, queueTimeline[i], false)) {
        rep_id = queueTimeline[i].id;
        break;
      }
    }
    if(latest_reply_id < rep_id) {
      latest_reply_id = rep_id;
      icon_reply = true;
    }
    refreshNotification();
  };
  
  var changeDirectMessageNotification = function() {
    if((queueDirectMessage == null) && (queueDirectMessage.length() > 0)) {
      return;
    }
    
    if(latest_directmessage_id < queueDirectMessage[0].id) {
      latest_directmessage_id = queueDirectMessage[0].id;
      icon_directmessage = true;
    }
    refreshNotification();
  };
  
  var refreshNotification = function() {
    if(icon_directmessage) {
      $('notification').innerHTML = '<img src="images/new_directmessage.png" />';
    } else if(icon_reply) {
      $('notification').innerHTML = '<img src="images/new_reply.png" />';
    } else if(icon_error) {
      $('notification').innerHTML = '<img src="images/log_error.png" />';
    } else {
      $('notification').innerHTML = '<img src="images/none.png" />';
    }
  };
  
  // change connecting icon
  var CONNECTION = {error: -1, not: 0, connected: 1, 
                    receive_tw: 2, send_tw: 3, receive_dm: 4, send_dm: 5};
  var changeConnection = function(connection) {
    switch(connection) {
    case CONNECTION.error:
      $('connection').innerHTML = '<img src="images/connection_error.png" />';
      break;
    case CONNECTION.not:
      $('connection').innerHTML = '<img src="images/not_connected.png" />';
      break;
    case CONNECTION.connected:
      $('connection').innerHTML = '<img src="images/connected.png" />';
      break;
    case CONNECTION.receive_tw:
      $('connection').innerHTML = '<img src="images/receive_tw.png" />';
      break;
    case CONNECTION.send_tw:
      $('connection').innerHTML = '<img src="images/send_tw.png" />';
      break;
    case CONNECTION.receive_dm:
      $('connection').innerHTML = '<img src="images/receive_dm.png" />';
      break;
    case CONNECTION.send_dm:
      $('connection').innerHTML = '<img src="images/send_dm.png" />';
      break;
    }
  };
  
  // merge queue from JSON
  var mergeQueue = function(base, delta) {
    
    for(var i = delta.length - 1; i >= 0; i--) {
      if(delta[i].id == base[0].id) {
        delta = delta.splice(0, i);
        break;
      }
    }
    base = delta.concat(base);
    return base;
  };
  
  // refresh function
  var refreshTimer = null;
  var refreshTimeline = function() {
    if(refreshTimer) {
      clearTimeout(refreshTimer);
    }
    
    if (settings.username != '') {
      Twigadge.getFriendsTimeline();
    } else {
      Twigadge.output(LOG_LEVEL.note, Local.setUsername);
      changeConnection(CONNECTION.not);
    }
    
    refreshTimer = setTimeout(function() { refreshTimeline(); }, 1000 * 60 * settings.interval);
  };
  
  var refreshDMTimer = null;
  var refreshDirectMessage = function() {
    if(refreshDMTimer) {
      clearTimeout(refreshDMTimer);
    }
    if (settings.username != '') {
      Twigadge.getDirectMessage();
    } else {
      Twigadge.output(LOG_LEVEL.note, Local.setUsername);
      changeConnection(CONNECTION.not);
    }
    
    refreshDMTimer = setTimeout(function() { refreshDirectMessage(); }, 1000 * 60 * settings.intervalDM);
  };
  
  // get diff time string
  var getDiffTime = function(t) {
    var str = '';
    var diff = new Date().getTime() - t;
    if(diff < 10 * 1000) {
      str = 'less than 10 seconds ago';
    } else if(diff < 30 * 1000) {
      str = 'less than a half minute ago';
    } else if(diff < 60 * 1000) {
      str = 'less than a minute ago';
    } else if(diff < 3600 * 1000) {
      str = parseInt(diff / 60000 + 1)  + ' minutes ago';
    } else if(diff < 2 * 3600 * 1000) {
      str = 'about 1 hour ago';
    } else if(diff <= 24 * 3600 * 1000) {
      str = 'about ' + parseInt(diff / 3600000 + 1) +' hours ago';
    } else {
      d = new Date(t);
      str = d.toLocalTimeString() + ' ' + d.toLocalDateString();
    }
    return str;
  };
  
  // get error messages
  var getError = function(errno) {
    switch(errno) {
    case 200:
      return 'OK';
    case 304:
      return Local.error304;
    case 400:
      return Local.error400;
    case 401:
      return Local.error401;
    case 403:
      return Local.error403;
    case 404:
      return Local.error404;
    case 500:
      return Local.error500;
    case 502:
      return Local.error502;
    case 503:
      return Local.error503;
    default:
      return errno + ' : unknown error';
    }
  };
  // ------------------------ public ------------------------
  return {
    DEBUG_LEVEL: LOG_LEVEL,
    
    userSettings: settings,
    
    scroll: function(count){
      var max = 30.0;
      if(count == 1){
        Scroller.count = 0;
        Scroller.y = $('main').scrollTop;
      }
    
      if(++Scroller.count <= max){
        var y = Scroller.y - Scroller.y * (Scroller.count / max);
        $('main').scrollTop = y;
        setTimeout('Twigadge.scroll()', 10);
      }
    },
    
    highlightScreenName: function(id) {
      $(id).style.background = '#cec87a';
    },
    
    unhighlightScreenName: function(id) {
      $(id).style.background = 'transparent';
    },
    
    getFriendsTimeline: function() {
      var url = 'http://twitter.com/statuses/friends_timeline.json';
      //var url = 'http://twitter.com/statuses/public_timeline.json';
      var method = (settings.usePOSTMethod) ? 'POST' : 'GET';
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true, settings.username, settings.password);
      xhr.setRequestHeader('If-Modified-Since', "Sat, 1 Jan 2000 00:00:00 GMT");
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.onreadystatechange = function(istimeout) {
        if(xhr && xhr.readyState == 4 && xhr.status == 200) {
          changeConnection(CONNECTION.connected);
          
          var json = eval('{table: ' + xhr.responseText + '}');
          if(queueTimeline == null) {
            queueTimeline = json;
          } else {
            queueTimeline = mergeQueue(queueTimeline, json);
          }
          queueTimeline = queueTimeline.splice(0, settings.queueSize);
          Twigadge.output(LOG_LEVEL.info, Local.getFriendsTimelineFinished);
          changeTimelineNotification();
          if((renderMode == MODES.timeline) || (renderMode == MODES.reply) || (renderMode == MODES.system)) {
            Twigadge.render();
            if(settings.autoScroll) Twigadge.scroll(1);
          }
        } else if(xhr && xhr.readyState == 4) {
          changeConnection(CONNECTION.error);
          Twigadge.output(LOG_LEVEL.error, getError(xhr.status));
        } else if(xhr && istimeout == 'timeout') {
          changeConnection(CONNECTION.error);
          Twigadge.output(LOG_LEVEL.error, Local.getFriendsTimelineTimeout);
        } else if(xhr && xhr.readyState == 3) {
          //changeConnection(CONNECTION.receive_tw);
          Twigadge.output(LOG_LEVEL.info, Local.getFriendsTimeline2);
        } else {
        }
      };
      changeConnection(CONNECTION.receive_tw);
      Twigadge.output(LOG_LEVEL.info, Local.getFriendsTimeline);
      xhr.send('');
    },
    
    getReply: function() {
      var url = 'http://twitter.com/statuses/replies.json';
      var method = (settings.usePOSTMethod) ? 'POST' : 'GET';
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true, settings.username, settings.password);
      xhr.setRequestHeader('If-Modified-Since', "Sat, 1 Jan 2000 00:00:00 GMT");
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.onreadystatechange = function(istimeout) {
        if(xhr && xhr.readyState == 4 && xhr.status == 200) {
          changeConnection(CONNECTION.connected);
          
          var json = eval('{table: ' + xhr.responseText + '}');
          if(queueTimeline == null) {
            queueTimeline = json;
          } else {
            queueTimeline = mergeQueue(queueTimeline, json);
          }
          queueTimeline = queueTimeline.splice(0, settings.queueSize);
          Twigadge.output(LOG_LEVEL.info, Local.getReplyFinished);
          changeTimelineNotification();
          if((renderMode == MODES.timeline) || (renderMode == MODES.reply) || (renderMode == MODES.system)) {
            Twigadge.render();
            if(settings.autoScroll) Twigadge.scroll(1);
          }
          Twigadge.refreshTL(); // 
        } else if(xhr && xhr.readyState == 4) {
          changeConnection(CONNECTION.error);
          Twigadge.output(LOG_LEVEL.error, getError(xhr.status));
        } else if(xhr && istimeout == 'timeout') {
          changeConnection(CONNECTION.error);
          Twigadge.output(LOG_LEVEL.error, Local.getReplyTimeout);
        } else if(xhr && xhr.readyState == 3) {
          //changeConnection(CONNECTION.receive_tw);
          Twigadge.output(LOG_LEVEL.info, Local.getReply2);
        } else {
        }
      };
      changeConnection(CONNECTION.receive_tw);
      Twigadge.output(LOG_LEVEL.info, Local.getReply);
      xhr.send('');
    },
    
    
    getDirectMessage: function() {
      
      var url = 'http://twitter.com/direct_messages.json?cache='+(new Date()).getTime();
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true, settings.username, settings.password);
      
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
      xhr.onreadystatechange = function(istimeout) {
        if(xhr && xhr.readyState == 4 && xhr.status == 200) {
          changeConnection(CONNECTION.connected);
          var json = eval('{table: ' + xhr.responseText + '}');
          if(queueDirectMessage == null) {
            queueDirectMessage = json;
          } else {
            queueDirectMessage = mergeQueue(queueDirectMessage, json);
          }
          
          queueDirectMessage = queueDirectMessage.splice(0, settings.queueSize);          Twigadge.output(LOG_LEVEL.info, Local.getDirectMessageFinished);
          changeDirectMessageNotification();
          if((renderMode == MODES.dm) || (renderMode == MODES.system)) {
            Twigadge.render();
            if(settings.autoScroll) Twigadge.scroll(1);
          }
        } else if(xhr && xhr.readyState == 4) {
          changeConnection(CONNECTION.error);
          Twigadge.output(LOG_LEVEL.error, getError(xhr.status));
        } else if(xhr && istimeout == 'timeout') {
          changeConnection(CONNECTION.error);
          Twigadge.output(LOG_LEVEL.error, Local.getDirectMessageTimeout);
        } else if(xhr && xhr.readyState == 3) {
          changeConnection(CONNECTION.receive_dm);
          Twigadge.output(LOG_LEVEL.info, Local.getDirectMessage2);
        } else {
        }
      };
      changeConnection(CONNECTION.receive_dm);
      Twigadge.output(LOG_LEVEL.info, Local.getDirectMessage);
      xhr.send('');
    },
    
    // insert system message to queue
    output: function(lv, msg) {
      if(queueSystemMessage == null) {
        queueSystemMessage = new Array();
      }
      
      if(lv == LOG_LEVEL.error) {
        icon_error = true;
        refreshNotification();
      }
      
      var messageUnit = {level: lv, message: msg, time: new Date().getTime(), id: ++systemmessage_id};
      queueSystemMessage.unshift(messageUnit);
      queueSystemMessage.slice(0, settings.queueSize);
      
    },
    
    // change display mode
    changeMode: function() {
      switch (renderMode) {
      case MODES.timeline:
        renderMode = MODES.dm;
        $('mode').innerHTML = '<img src="images/directmessage.png" />';
        break;
      case MODES.dm:
        renderMode = MODES.reply;
        $('mode').innerHTML = '<img src="images/reply.png" />';
        break;
      case MODES.reply:
        renderMode = MODES.system;
        $('mode').innerHTML = '<img src="images/system.png" />';
        break;
      case MODES.system:
        renderMode = MODES.timeline;
        $('mode').innerHTML = '<img src="images/timeline.png" />';
        break;
      }
      $('main').innerHTML = '<center><img src="images/loading.gif" /></center>';
      setTimeout(Twigadge.render, 100);
    },
    
    render: function() {
      document.body.style.width = settings.width + 'px';
      document.body.style.height = settings.height + 'px';
      $('main').style.height = (settings.height - 16) + 'px';
      switch (renderMode) {
      case MODES.timeline:
        renderTimeline();
        break;
      case MODES.dm:
        renderDirectMessage();
        break;
      case MODES.reply:
        renderReply();
        break;
      case MODES.system:
        renderSystemMessage();
        break;
      }
    },
    
    refresh: function() {
      switch (renderMode) {
      case MODES.timeline:
      case MODES.reply:
      case MODES.system:
        Twigadge.refreshTL();
        break;
      case MODES.dm:
        Twigadge.refreshDM();
        break;
      }
    },
    
    refreshTL: function() {
      if(refreshTimer) {
        clearTimeout(refreshTimer);
      }
      refreshTimer = setTimeout(function() { refreshTimeline(); }, 100);
    },
    
    refreshDM: function() {
      if(refreshDMTimer) {
        clearTimeout(refreshDMTimer);
      }
      refreshDMTimer = setTimeout(function() { refreshDirectMessage(); }, 100);
    },
    
    /**
     * show SEND flyout and set message to text area (if any)
     */
    setSendMessageFlyout: function(message) {
      System.Gadget.Flyout.file = 'sendmessage.html';
      System.Gadget.Flyout.onShow = function() { 
        var uptext = System.Gadget.Flyout.document.getElementById('update-text');
        if(typeof message != "undefined") {
          uptext.value = message;
        } else if(renderMode == MODES.dm) {
          uptext.value = "d ";
        }
        uptext.focus();
      };
      
      if(System.Gadget.Flyout.show) {
        System.Gadget.Flyout.show = false;
      } else {
        System.Gadget.Flyout.show = true;
        flyoutType = 'send';
        
      }
    },
    
    /**
     * open SEND flyout for reply
     * if STATUS flyout is showing, close it and open SEND flyout.
     * if SEND flyout is showing, append '@username '. 
     * (if first letter is NOT '.', insert '.').
     */
    reply: function(name) {
      // 
      if(System.Gadget.Flyout.show && (flyoutType == 'status')) {
        System.Gadget.Flyout.show = false;
        return ;
      } else if(System.Gadget.Flyout.show && (flyoutType == 'send')) {
        var uptext = System.Gadget.Flyout.document.getElementById('update-text');
        if(uptext.value.charAt(0) == '@') {
          uptext.value = '. ' + uptext.value;
        }
        uptext.value += '@' + name + ' ';
        uptext.focus();
      } else {
        Twigadge.setSendMessageFlyout('@' + name + ' ');
      }
    },
    
    /**
     * open SEND flyout for direct message
     * if STATUS flyout is showing, close it and open SEND flyout.
     * text area will be cleared on showing SEND flyout.
     */
    replyDM: function(name) {
      if(System.Gadget.Flyout.show && (flyoutType == 'status')) {
        System.Gadget.Flyout.show = false;
        return ;
      } else if(System.Gadget.Flyout.show && (flyoutType == 'send')) {
        var uptext = System.Gadget.Flyout.document.getElementById('update-text');
        uptext.value = 'd ' + name + ' ';
        uptext.focus();
      } else {
        Twigadge.setSendMessageFlyout('d ' + name + ' ');
      }
    },
    
    /**
     * send message for update status
     */
    updateStatus: function() {
      var url = 'http://twitter.com/statuses/update.json';
      var uptext = System.Gadget.Flyout.document.getElementById('update-text');
      var upbutton = System.Gadget.Flyout.document.getElementById('update-button');
      xhr = new XMLHttpRequest();
      xhr.open('POST', url, true, settings.username, settings.password);
      xhr.setRequestHeader('If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.onreadystatechange = function(istimeout) {
        if(xhr && xhr.readyState == 4) {
          Twigadge.output(LOG_LEVEL.info, Local.updateStatusFinished);
          upbutton.disabled = false;
          System.Gadget.Flyout.show = false;
        } else if(xhr && istimeout == 'timeout') {
          uptext.value = Local.updateStatusTimeout;
          Twigadge.output(LOG_LEVEL.error, Local.updateStatusTimeout);
          upbutton.disabled = false;
        } else if(xhr && xhr.readyState == 3) {
          uptext.value = Local.updateStatus2;
          Twigadge.output(LOG_LEVEL.info, Local.updateStatus2);
        } else {
        }
      };
      xhr.send('source=twigadge&status=' + encodeURIComponent(uptext.value));
      uptext.value = Local.updateStatus;
      Twigadge.output(LOG_LEVEL.info, Local.updateStatus);
      upbutton.disabled = true;
    },
    
    /**
     * open STATUS flyout
     * if flyout is showing, close it.
     */
    showStatus: function(n) {
      if(System.Gadget.Flyout.show) {
        System.Gadget.Flyout.show = false;
        return ;
      }
      
      // get twit from queue
      if(n >= queueTimeline.length) return;
      var twit = queueTimeline[n];
      
      System.Gadget.Flyout.file = 'statuses.html';
      System.Gadget.Flyout.onShow = function() { 
        
        // set link and buzzwords to text
        var httpURL = /(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g;  //'
        var body = twit.text.replace(httpURL, '<a href="$1">$1</a>');
        
        // highlight buzzword (from buzztter)
        if(settings.buzztter.enable) {
          body = Buzztter.replace(body);
        }
        
        // convert <3 to heart
        if(settings.enableHeart) {
          body = body.replace(/&lt;3/g, '<img class="heart" src="images/heart.png" />');
        }
        
        var doc = System.Gadget.Flyout.document;
        var comment = doc.getElementById('comment');
        comment.innerHTML = body;
        var time = doc.getElementById('time');
        var t = twit.created_at.split(' ');
        var d = new Date(t[1] + ' ' + t[2] + ',' + t[5] + ' ' + t[3] + ' ' + t[4]);
        time.innerHTML = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
        var source = doc.getElementById('source');
        source.innerHTML = twit.source;
        var fav = doc.getElementById('fav');
        if(twit.favorited) {
          fav.innerHTML = '<img onclick="unfavorite(\'' + twit.id + '\')" src="images/fav.gif" />';
        } else {
          fav.innerHTML = '<img onclick="favorite(\'' + twit.id + '\')" src="images/fav_gray.gif" />';
        }
        var image = doc.getElementById('profile-image');
        image.innerHTML = '<img src="' + twit.user.profile_image_url + '"/>';
        var name = doc.getElementById('username');
        name.innerHTML = twit.user.name;
        var home = doc.getElementById('home');
        home.innerHTML = '<a class="twitter" href="http://twitter.com/' + twit.user.screen_name + '">Twitter</a>';
        var web = doc.getElementById('web');
        if(twit.user.url != null) {
          web.innerHTML = '<a class="twitter" href="' + twit.user.url + '">Web</a>';
        } else {
          web.innerHTML = '';
        }
        doc.body.style.height = comment.scrollHeight + 120;
        doc.focus();
      };
      
      System.Gadget.Flyout.show = true;
    },
    
    /**
     * open DM flyout
     * if flyout is showing, close it.
     */
    showDirectMessage: function(n) {
      if(System.Gadget.Flyout.show) {
        System.Gadget.Flyout.show = false;
        return ;
      }
      
      // get twit from queue
      if(n >= queueDirectMessage.length) return;
      var dm = queueDirectMessage[n];
      
      System.Gadget.Flyout.file = 'directmessage.html';
      System.Gadget.Flyout.onShow = function() { 
        
        // set link
        var httpURL = /(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g;  //'
        var body = dm.text.replace(httpURL, '<a href="$1">$1</a>');
        
        
        var doc = System.Gadget.Flyout.document;
        var comment = doc.getElementById('comment');
        comment.innerHTML = body;
        var time = doc.getElementById('time');
        var t = dm.created_at.split(' ');
        var d = new Date(t[1] + ' ' + t[2] + ',' + t[5] + ' ' + t[3] + ' ' + t[4]);
        time.innerHTML = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
        var image = doc.getElementById('profile-image');
        image.innerHTML = '<img src="' + dm.sender.profile_image_url + '"/>';
        var name = doc.getElementById('username');
        name.innerHTML = dm.sender.name;
        var home = doc.getElementById('home');
        home.innerHTML = '<a class="twitter" href="http://twitter.com/' + dm.sender.screen_name + '">Twitter</a>';
        var web = doc.getElementById('web');
        if(dm.sender.url != null) {
          web.innerHTML = '<a class="twitter" href="' + dm.sender.url + '">Web</a>';
        } else {
          web.innerHTML = '';
        }
        doc.body.style.height = comment.scrollHeight + 120;
        doc.focus();
      };
      
      System.Gadget.Flyout.show = true;
    },
    
    /**
     * favorite the id status
     */
    favorite: function(id) {
      var url = 'http://twitter.com/favorites/create/' + id + '.json';
      var fav_image = System.Gadget.Flyout.document.getElementById('fav');
      xhr = new XMLHttpRequest();
      xhr.open('POST', url, true, settings.username, settings.password);
      xhr.setRequestHeader('If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.onreadystatechange = function(istimeout) {
        if(xhr && xhr.readyState == 4) {
          Twigadge.output(LOG_LEVEL.info, Local.favoriteFinished);
          fav_image.innerHTML = '<img onclick="unfavorite(\'' + id + '\')" src="images/fav.gif" />';
          for(var i = 0; i < queueTimeline.length; i++) {
            if(queueTimeline[i].id == id) {
              queueTimeline[i].favorited = true;
            }
          }
        } else if(xhr && istimeout == 'timeout') {
          Twigadge.output(LOG_LEVEL.error, Local.favoriteTimeout);
          fav_image.innerHTML = '<img onclick="favorite(\'' + id + '\')" src="images/fav_gray.gif" />';
        } else if(xhr && xhr.readyState == 3) {
          Twigadge.output(LOG_LEVEL.info, Local.favorite2);
        } else {
        }
      };
      fav_image.innerHTML = '<img src="images/fav_sending.gif" />';
      Twigadge.output(LOG_LEVEL.info, Local.favorite);
      xhr.send('');
    }, 
    
    /**
     * unfavorite the id status
     */
    unfavorite: function(id) {
      var url = 'http://twitter.com/favorites/destroy/' + id + '.json';
      var fav_image = System.Gadget.Flyout.document.getElementById('fav');
      xhr = new XMLHttpRequest();
      xhr.open('POST', url, true, settings.username, settings.password);
      xhr.setRequestHeader('If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.onreadystatechange = function(istimeout) {
        if(xhr && xhr.readyState == 4) {
          Twigadge.output(LOG_LEVEL.info, Local.unfavoriteFinished);
          fav_image.innerHTML = '<img onclick="favorite(\'' + id + '\')" src="images/fav_gray.gif" />';
          for(var i = 0; i < queueTimeline.length; i++) {
            if(queueTimeline[i].id == id) {
              queueTimeline[i].favorited = false;
            }
          }
        } else if(xhr && istimeout == 'timeout') {
          Twigadge.output(LOG_LEVEL.error, Local.unfavoriteTimeout);
          fav_image.innerHTML = '<img onclick="unfavorite(\'' + id + '\')" src="images/fav.gif" />';
        } else if(xhr && xhr.readyState == 3) {
          Twigadge.output(LOG_LEVEL.info, Local.unfavorite2);
        } else {
        }
      };
      fav_image.innerHTML = '<img src="images/fav_sending.gif" />';
      Twigadge.output(LOG_LEVEL.info, Local.unfavorite);
      xhr.send('');
    },
    /**
     * event handler on dock state changed
     */
    dockStateChanged : function() {
      if(System.Gadget.docked) {
        settings.width = System.Gadget.Settings.read('docked_width');
        if (!settings.width || settings.width < 20) settings.width = 130;
        settings.height = System.Gadget.Settings.read('docked_height');
        if (!settings.height || settings.height < 60) settings.height = 200;
      } else {
        settings.width = System.Gadget.Settings.read('undocked_width');
        if (!settings.width || settings.width < 20) settings.width = 280;
        settings.height = System.Gadget.Settings.read('undocked_height');
        if (!settings.height || settings.height < 60) settings.height = 350;
      }
      Twigadge.refresh();
    },
    
    turnOffNotification: function() {
      if(icon_directmessage) {
        icon_directmessage = false;    
      } else if(icon_reply) {
        icon_reply = false;
      } else if(icon_error) {
        icon_error = false;
      }
      refreshNotification();
    }
  };
}(); // Namespace twigadge

