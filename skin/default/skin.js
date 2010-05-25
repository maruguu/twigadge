/**
 * default skin
 */
Skin = function() {
  this.tl_started = false; // timeline view is started or not
};

Skin.prototype.initializeHeader = function() {
  $("#header").empty();
};

Skin.prototype.initializeMain = function() {
  var path = ViewManager.getSkinFolder();
  $("#main").empty();
  $("#main").append('<center><img src="' + path + '/images/loading.gif" /></center>');
  $("#main").css("height", Twigadge.userSettings.height - 16);
};

Skin.prototype.initializeFooter = function() {
  var path = ViewManager.getSkinFolder();
  $("#footer").empty();
  $("#footer").css("height", 16);
  $("#footer").append('<table cellspacing="0" cellpadding="0" onMouseOver="hideMenu()"><tr><td id="update"><img src="' + path + '/images/update.png" onClick="ViewManager.showUpdateFlyout()" onMouseOver="popupHelp(1)" onMouseOut="hideHelp()" /></td><td width="100%"></td><td id="notification"><img src="' + path + '/images/none.png" /></td><td id="connection"><img src="' + path + '/images/not_connected.png" /></td><td id="mode"><img src="' + path + '/images/timeline.png" onClick="popupMenu()" onMouseOver="popupHelp(3)" onMouseOut="hideHelp()" /></td><td><a class="twitter_link" href="http://www.twitter.com/home/" ><img src="' + path + '/images/home.png" onMouseOver="popupHelp(4)" onMouseOut="hideHelp()" /></a></td><td id="reload"><img src="' + path + '/images/reload.png" onMouseOver="popupHelp(5)" onMouseOut="hideHelp()" onClick="ViewManager.reload()" /></td></tr></table><br /><div id="menu" style="visibility: hidden; position: absolute;"></div><div id="help" style="visibility: hidden; position: absolute;"></div>');
};

/**
 * popup help
 */
var popupHelp = function(no) {
  txt = new Array();
  txt[1] = 'TWEET';
  txt[2] = '';
  txt[3] = 'TL/REPLY/DM';
  txt[4] = 'HOME';
  txt[5] = 'RELOAD';
  var char_length = 10;
  var x = event.x - 16;
  if(x < 0) x = 0;
  if(x + txt[no].length * char_length >= Twigadge.userSettings.width) x = Twigadge.userSettings.width - txt[no].length * char_length;
  var y = event.y - 24;
  if(y < 0) y = 0;
  $("#help").empty();
  $("#help").append(txt[no]);
  $("#help").css("left", x);
  $("#help").css("top", y);
  $("#help").css("visibility", "visible");
  
};


/**
 * hide popup help
 */
var hideHelp = function() {
  $("#help").css("visibility", "hidden");
};


/**
 * popup menu
 */
var popupMenu = function() {
  var path = ViewManager.getSkinFolder();
  var txt = '<table cellspacing="0" cellpadding="0"><tr><td class="menu"><img src="' + path + '/images/timeline.png" style="cursor: pointer" onMouseOver="popupMenuHelp(1)" onMouseOut="hideHelp()" onClick="ViewManager.changeViewToTL()" /></td></tr><tr><td class="menu"><img src="' + path + '/images/reply.png" style="cursor: pointer" onMouseOver="popupMenuHelp(2)" onMouseOut="hideHelp()" onClick="ViewManager.changeViewToReply()" /></td></tr><tr><td class="menu"><img src="' + path + '/images/directmessage.png" style="cursor: pointer" onMouseOver="popupMenuHelp(3)" onMouseOut="hideHelp()" onClick="ViewManager.changeViewToDM()" /></td></tr><tr><td><img src="' + path + '/images/none.png" /></td></tr></table>';
  $("#menu").empty();
  $("#menu").append(txt);
  $("#menu").css("left", Twigadge.userSettings.width - 48);
  $("#menu").css("top", Twigadge.userSettings.height - 64 - 6);
  $("#menu").css("visibility", "visible");
};


/**
 * hide popup Menu
 */
var hideMenu = function() {
  $("#menu").css("visibility", "hidden");
};

/**
 * popup menu help
 */
var popupMenuHelp = function(no) {
  txt = new Array();
  txt[1] = 'Timeline';
  txt[2] = 'Reply';
  txt[3] = 'DM';
  var char_length = 10;
  var x = event.x - 36;
  if(x < 0) x = 0;
  if(x + txt[no].length * char_length >= Twigadge.userSettings.width) x = Twigadge.userSettings.width - txt[no].length * char_length;
  var y = event.y - 24;
  if(y < 0) y = 0;
  $("#help").empty();
  $("#help").append(txt[no]);
  $("#help").css("left", x);
  $("#help").css("top", y);
  $("#help").css("visibility", "visible");
  
};


// Entry point for refresh friends timeline
Skin.prototype.renderFriendsTimeline = function(queue) {
  this.tl_started = true;
  var settings = Twigadge.userSettings;
  document.body.style.width = settings.width + 'px';
  document.body.style.height = settings.height + 'px';
  $("#main").empty();
  
  if(queue == null) return ;
  if(queue.length < 1) return ;
  
  var timeline = '';
  for(var i = 0; i < queue.length; i++) {
    timeline += getTwitHTML(queue[i], i);
  }
  $("#main").append(timeline);
};

// Entry point for refresh DM
Skin.prototype.renderDM = function(queue) {
  var settings = Twigadge.userSettings;
  document.body.style.width = settings.width + 'px';
  document.body.style.height = settings.height + 'px';
  $("#main").empty();
  
  if(queue == null) return ;
  if(queue.length < 1) return ;
  
  var timeline = '';
  for(var i = 0; i < queue.length; i++) {
    timeline += getDMHTML(queue[i], i);
  }
  $("#main").append(timeline);
};

// Entry point for refresh system message
Skin.prototype.renderSystemMessage = function(queue) {
  if(queue == null) return ;
  if(queue.length < 1) return ;
  
  // if timeline view is started, not render system message
  if(this.tl_started) return;
  
  // display the middle of the gadget (height / 2 - 20)
  var settings = Twigadge.userSettings;
  alignment = settings.height / 2 - 20;
  $("#main").empty();
  var message = '<table cellspacing="0" cellpadding="0"><tr><td height="' + alignment + '"></td></tr></table><p class="block"><table cellspacing="0" cellpadding="0"><tr><td><img src="' + getLogIcon(queue[0].level) + '" /></td><td>' + queue[0].message + '<br /></ td></tr></table></p>';
  $("#main").append(message);
};

var getLogIcon = function(lv) {
  var path = '';
  switch(lv) {
  case Twigadge.LOG_LV.ERROR:
    path = ViewManager.getSkinFolder() + '/images/log_error.png';
    break;
  case Twigadge.LOG_LV.WARNING:
    path = ViewManager.getSkinFolder() + '/images/log_warning.png';
    break;
  case Twigadge.LOG_LV.NOTE:
    path = ViewManager.getSkinFolder() + '/images/log_note.png';
    break;
  case Twigadge.LOG_LV.INFO:
    path = ViewManager.getSkinFolder() + '/images/log_info.png';
    break;
  }
  return path;
};

var decorateHTML = function(txt) {
  var settings = Twigadge.userSettings;
  var httpURL = /(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g;  //'
  txt = txt.replace(httpURL, '<a href="$1">$1</a>');
  var hashtags = /(^|[] !""$%&'()*+,-.:;<=>?@[\^`{|}~])#([^] !""#$%&'()*+,-.:;<=>?@[\^`{|}~\r\n]+)/g;
  txt = txt.replace(hashtags, '<a href="http://search.twitter.com/search?q=%23$2">#$2</a>');
  
  // highlight buzzword (from buzztter)
  if(settings.buzztter.enable) {
    txt = Buzztter.replace(txt);
  }
  /*
  // convert <3 to heart
  if(settings.enableHeart) {
    txt = txt.replace(/&lt;3/g, '<img class="heart" src="images/heart.png" />');
  }
  */
  return txt;
};

var getTwitHTML = function(twit, no) {
  var settings = Twigadge.userSettings;
  
  var width = (settings.width - 22);
  var img_width = (System.Gadget.docked) ? '20' : '48';
  var bg_position = (System.Gadget.docked) ? '-10' : '0';
  var body = decorateHTML(twit.text);
  
  var template = '<p class="block" id="block' + twit.id + '" ' + fixedStyle() + '><table cellspacing="0" cellpadding="0"><tr><td width="' + width + '" ' + replyStyle(twit) + '><table class="user_image" background="' + twit.user.profile_image_url + '" width="' + img_width + '" style="background-position : ' + bg_position + 'px 0px;" align="left" onclick="ViewManager.showTwitFlyout(\'' + twit.id + '\')"><tr><td></td></tr></table><b><div class="screen_name" id="screen_name' + twit.id + '" onclick="ViewManager.replyTo(\'' + twit.id + '\')" onmouseover="highlightScreenName(\'screen_name' + twit.id + '\')" onmouseout="unhighlightScreenName(\'screen_name' + twit.id + '\')">' + twit.user.screen_name +  '</div></b><div >' + body + '</div></td></tr></table></p>';
  
  return template;
};

/**
 * get html for direct message
 * @param[in] (DM)dm
 * @param[in] (int)no
 */
var getDMHTML = function(dm, no) {
  var settings = Twigadge.userSettings;
  
  var width = (settings.width - 22);
  var img_width = (System.Gadget.docked) ? '20' : '48';
  var bg_position = (System.Gadget.docked) ? '-10' : '0';
  var body = decorateHTML(dm.text);
  
  var template = '<p class="block" id="block' + dm.id + '" ' + fixedStyle() + '><table cellspacing="0" cellpadding="0"><tr><td width="' + width + '" ><table class="user_image" background="' + dm.sender.profile_image_url + '" width="' + img_width + '" style="background-position : ' + bg_position + 'px 0px;" align="left"><tr><td></td></tr></table><b><div class="screen_name" id="screen_name' + dm.id + '" onclick="ViewManager.dmReplyTo(\'' + dm.sender.screen_name + '\')" onmouseover="highlightScreenName(\'screen_name' + dm.id + '\')" onmouseout="unhighlightScreenName(\'screen_name' + dm.id + '\')">' + dm.sender.screen_name +  '</div></b><div >' + body + '</div></td></tr></table></p>';
  
  return template;
};

// return stylesheet for fixed block
var fixedStyle = function() {
  var settings = Twigadge.userSettings;
  if(settings.fixedBlock) {
    return 'style="height:48px; overflow:hidden;"';
  } else {
    return '';
  }
};

// return stylesheet for reply
var replyStyle = function(twit) {
  var settings = Twigadge.userSettings;
  
  if(isReply(settings.screen_name, twit, false)) {
    return 'bgcolor="#7acec8" ';
  } else {
    return '';
  }
};

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

var highlightScreenName = function() {
};

var unhighlightScreenName = function() {
};

// show connection status of friend timeline.
// @param[in] (boolean)finished - the connection is finished or not.
Skin.prototype.showConnectionOfFriendTL = function(finished) {
  var path = ViewManager.getSkinFolder();
  var image;
  if(finished) {
    image = path + "/images/connected.png";
  } else {
    image = path + "/images/receive_tw.png";
  }
  $("#connection").empty();
  $("#connection").append('<img src="' + image + '" />');
};

/**
 * show connection status of post to timeline.
 * @param[in] (boolean)finished - the connection is finished or not.
 */
Skin.prototype.showConnectionOfPostTL = function(finished) {
  var path = ViewManager.getSkinFolder();
  var image;
  if(finished) {
    image = path + "/images/connected.png";
  } else {
    image = path + "/images/send_tw.png";
  }
  $("#connection").empty();
  $("#connection").append('<img src="' + image + '" />');
};


/**
 * show xonnection error status
 * change status icon to connection error
 */
Skin.prototype.showConnectionError = function() {
  var path = ViewManager.getSkinFolder();
  var image = path + "/images/not_connected.png";
  $("#connection").empty();
  $("#connection").append('<img src="' + image + '" />');
};

/**
 * show loading status
 * change status icon to loading
 */
Skin.prototype.showLoading = function() {
  var path = ViewManager.getSkinFolder();
  var image = path + "/images/loading.gif";
  $("#connection").empty();
  $("#connection").append('<img src="' + image + '" />');
};

Skin.prototype.showTwitFlyout = function(twit) {
  var path = ViewManager.getSkinFolder();
  System.Gadget.Flyout.file = path + '/twit.html';
  
  var body = decorateHTML(twit.text);
  System.Gadget.Flyout.onShow = function() {
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
      fav.innerHTML = '<img onclick="unfavorite(\'' + twit.id + '\')" src="images/fav.gif" style="cursor: pointer" />';
    } else {
      fav.innerHTML = '<img onclick="favorite(\'' + twit.id + '\')" src="images/fav_gray.gif" style="cursor: pointer" />';
    }
    var retweet = doc.getElementById('retweet');
    retweet.innerHTML = '<div onclick="retweet(\'' + twit.id + '\')" style="font-size : 8pt;">Retweet</div>';
    var image = doc.getElementById('profile-image');
    image.innerHTML = '<img src="' + twit.user.profile_image_url + '"  height="48"  width="48"/>';
    var name = doc.getElementById('username');
    name.innerHTML = twit.user.name;
    var rt = doc.getElementById('rt_format');
    rt.innerHTML = '<div onclick="rt_format(\'' + twit.id + '\')" style="cursor: pointer"><img src="images/rt.png"/></div>';
    var home = doc.getElementById('home');
    home.innerHTML = '<a class="twitter" href="http://twitter.com/' + twit.user.screen_name + '"><img src="images/tl.png"/></a>';
    var web = doc.getElementById('web');
    if(twit.user.url != null) {
      web.innerHTML = '<a class="twitter" href="' + twit.user.url + '"><img src="images/web.png"/></a>';
    } else {
      web.innerHTML = '';
    }
    doc.body.style.height = comment.scrollHeight + 130;
  };
  System.Gadget.Flyout.show = true;
};

/**
 * show update flyout.
 * @param[in] (string)text - default text.
 * @param[in] (tweet)target_tweet - the target tweet for reply
 */
Skin.prototype.showUpdateFlyout = function(text, target_tweet) {
  var path = ViewManager.getSkinFolder();
  System.Gadget.Flyout.file = path + '/update.html';
  
  System.Gadget.Flyout.onShow = function() {
    if(typeof target_tweet != "undefined") {
      var targetname = System.Gadget.Flyout.document.getElementById('target-name');
      targetname.innerHTML = 'Reply To: ' + twit.user.name + ' ';
      var reply_to = System.Gadget.Flyout.document.getElementById('in-reply-to');
      reply_to.innerHTML = twit.id;
    }
    var doc = System.Gadget.Flyout.document;
    var uptext = doc.getElementById('update-text');
    if(typeof text != "undefined") {
      uptext.value = text;
    }
    uptext.focus();
  };
  System.Gadget.Flyout.show = true;
};

/**
 * update favorite status in twit flyout
 * @param[in] (Twigadge.FAVORITE)favorite - favorite status
 */
Skin.prototype.updateFavStatusInTwitFlyout = function(favorite) {
  var doc = System.Gadget.Flyout.document;
  var fav = doc.getElementById('fav');
  switch(favorite) {
  case Twigadge.FAVORITE.TRUE:
    fav.innerHTML = '<img onclick="unfavorite(\'' + twit.id + '\')" src="images/fav.gif" style="cursor: pointer" />';
    break;
  case Twigadge.FAVORITE.FALSE:
    fav.innerHTML = '<img onclick="favorite(\'' + twit.id + '\')" src="images/fav_gray.gif" style="cursor: pointer" />';
    break;
  case Twigadge.FAVORITE.CHANGING:
    fav.innerHTML = '<img src="images/fav_sending.gif" />';
    break;
  }
};

/**
 * show oauth authorization window
 * @param[in] (string)oauth_token - for accessing authorization page.
 * @param[in] (string)errorMsg - error message.
 */
Skin.prototype.showOAuthAuthorization = function(oauth_token, errorMsg) {
  // display the middle of the gadget (height / 2 - 20)
  var settings = Twigadge.userSettings;
  alignment = settings.height / 2 - 40;
  $("#main").empty();
  var message = '<table cellspacing="0" cellpadding="0"><tr><td height="' + alignment + '"></td></tr></table><p class="block"><table cellspacing="0" cellpadding="0"><tr><td><img src="' + getLogIcon(Twigadge.LOG_LV.INFO) + '" /><a href="http://twitter.com/oauth/authorize?oauth_token=' + oauth_token + '">' + Local.getOAuthVerifier + '</a><br /></ td></tr><tr><td>' + Local.setPIN + '</td></tr><tr><td><input id="pin-input" size="10" type="text" maxlength="7" /></tr></td><tr><td style="text-align:center"><div onclick="sendPIN()" style="cursor: pointer">OK</div></td></tr></table></p>';
  if(typeof errorMsg != "undefined") {
    message += '<table cellspacing="0" cellpadding="0"><tr><td><img src="' + getLogIcon(Twigadge.LOG_LV.ERROR) + '" /></td><td>' + errorMsg + '<br /></ td></tr></table>';
  }
  $("#main").append(message);
};

/**
 * send PIN to twitter
 */
var sendPIN = function() {
  var doc = System.Gadget.document;
  var uptext = doc.getElementById('pin-input');
  if(uptext.value == "") {
    return;
  }
  ViewManager.authorize(uptext.value);
};


/**
 * update reply target
 * @param[in] (string)screen_name - reply target
 */
Skin.prototype.updateReplyTarget = function(screen_name) {
  var uptext = System.Gadget.Flyout.document.getElementById('update-text');
  if(uptext.value.charAt(0) == '@') {
    uptext.value = '. ' + uptext.value;
  }
  uptext.value += '@' + screen_name + ' ';
  uptext.focus();
};

var scroll_helper = function(state) {
  var max = 30.0;
  if(++state.count <= max){
    var y = state.y - state.y * (state.count / max);
    $("#main").attr('scrollTop', y);
    setTimeout(function() { scroll_helper(state); }, 10);
  }
};

/**
 * scroll
 */
Skin.prototype.scroll = function(start) {
  var state = {y: 0, count: 0};
  state.y = $("#main").attr('scrollTop');
  setTimeout(function() { scroll_helper(state); }, 10);
};

