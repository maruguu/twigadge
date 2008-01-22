/*
 * gadget.js
 *   main module - twigadge
 */
var Gadget = {}; // Namespace
var us;         // User Settings
var json;       // JSON format
var refreshTimer;

// ---- Scroll -----------------
var Scroll = {
  y: 0, count: 0
};

Scroll.scroller = function(cnt){
  var MAX = 30.0;
  if(cnt == 1){
    Scroll.count = 0;
    Scroll.y = $('gadget').scrollTop;
  }
  
  if(++Scroll.count <= MAX){
    var y = Scroll.y - Scroll.y * (Scroll.count / MAX);
    $('gadget').scrollTop = y;
    window.setTimeout('Scroll.scroller()', 10);
  }
}
// ------------------------------------

Gadget.updateStatus = function() {
  var url = 'http://twitter.com/statuses/update.json';
  var uptext = System.Gadget.Flyout.document.getElementById('update-text');
  var upbutton = System.Gadget.Flyout.document.getElementById('update-button');
  xhr = new XMLHttpRequest();
  xhr.open('POST', url, true, us.username, us.password);
  xhr.setRequestHeader('If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function(istimeout) {
    if(xhr && xhr.readyState == 4) {
      $('output').innerHTML = LOCAL.send_finish;
      upbutton.disabled = '';
      System.Gadget.Flyout.show = false;
    } else if(xhr && istimeout == 'timeout') {
      uptext.value = LOCAL.send_timeout;
      upbutton.disabled = '';
    } else if(xhr && xhr.readyState == 3) {
      uptext.value = LOCAL.send_cation2;
    } else {
    }
  };
  xhr.send('source=twigadge&status=' + encodeURI(uptext.value));
  $('output').innerHTML = LOCAL.send_message;
  uptext.value = LOCAL.send_cation;
}

//---- inline functions ---------------
function changeBgColor(id) {
  $(id).style.background = '#cec87a';
}

function backBgColor(id) {
   $(id).style.background = 'transparent';
}

function reply(name) {
  if(System.Gadget.Flyout.show) {
    var uptext = System.Gadget.Flyout.document.getElementById('update-text');
    uptext.value += '@' + name + ' ';
    uptext.focus();
  } else {
    System.Gadget.Settings.write('replyTo', name);
    Gadget.setFlyout();
  }
}
//-------------------------------------

Gadget.render = function() {
  var httpURL = /(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g; // '
  var txt = '';
  var w = (us.width - 22); // <td width=
  var iSize = (System.Gadget.docked) ? '20' : '40'; // Image size
  var bgc;
  
  document.body.style.width = us.width + 'px';
  document.body.style.height = us.height + 'px';
  
  $('gadget').innerHTML = '<div class="render" id="render"></div>';
  $('render').style.height = (us.height - 20) + 'px';
  if(json) {
    for(var i = 0; i < json.length; i++) {
      if(us.username != '') {
        if(json[i].text.indexOf('@' + us.username) >= 0) {
          bgc = 'bgcolor="#7acec8" ';
        } else {
          bgc = '';
        }
      }
      // URL replace
      var body = json[i].text.replace(httpURL, '<a href="$1">$1</a>');
      body = BuzzHighlight(body);
      
      txt += '<p class="comment">';
      txt += '<table cellspacing="0" cellpadding="0">';
      txt += '<tr><td width="' + w + '" ' + bgc + '>';
      txt += '<div class="scr_name"';
      txt += ' onclick="reply(\'' + json[i].user.screen_name +'\')" >';
      txt += '<table class="user_image"';
      txt += ' background="' + json[i].user.profile_image_url + '"';
      txt += ' width="' + iSize + '" height="40" align="left">';
      txt += '<tr><td></td></tr></table>';
      txt += '</div>';
      txt += '<b><div class="scr_name" id="scr_name' + i + '"';
      txt += ' onclick="reply(\'' + json[i].user.screen_name + '\')"';
      txt += ' onmouseover="changeBgColor(\'scr_name' + i + '\')"';
      txt += ' onmouseout="backBgColor(\'scr_name' + i + '\')" >';
      txt += json[i].user.screen_name + '</div></b>';
      txt += body;
      txt += '</td></tr></table>';
      txt += '</p>';
    }
    $('render').innerHTML = txt;
  }
  if(us.scroller) Scroll.scroller(1);
}

Gadget.getFriendsTimeline = function() {
  var url = 'http://twitter.com/statuses/friends_timeline.json';
  var get_method = (us.post) ? 'POST' : 'GET';
  var xhr = new XMLHttpRequest();
  xhr.open(get_method, url, true, us.username, us.password);
  xhr.setRequestHeader('If-Modified-Since', "Sat, 1 Jan 2000 00:00:00 GMT");
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function(istimeout) {
    if(xhr && xhr.readyState == 4 && xhr.status == 200) {
      json = eval('{table: ' + xhr.responseText + '}');
      $('output').innerHTML = LOCAL.recv_finish;
      Gadget.render();
    } else if(xhr && xhr.readyState == 4) {
      $('output').innerHTML = xhr.status + ':' + xhr.statusText;
    } else if(xhr && istimeout == 'timeout') {
      $('output').innerHTML = LOCAL.recv_timeout;
    } else if(xhr && xhr.readyState == 3) {
      $('output').innerHTML = LOCAL.recv_message2;
    } else {
    }
  };
  xhr.send('');
  $('output').innerHTML = LOCAL.recv_message;
}

Gadget.settingsClosed = function(p_event) {
  if (p_event.closeAction == p_event.Action.commit) {
    us.read();
    Gadget.refreshTimeline();
  }
}

Gadget.dockStateChanged = function() {
  if(System.Gadget.docked) {
    us.width = System.Gadget.Settings.read('docked_width');
    if (!us.width || us.width < 20) us.width = 130;
    us.height = System.Gadget.Settings.read('docked_height');
    if (!us.height || us.height < 60) us.height = 200;
  } else {
    us.width = System.Gadget.Settings.read('undocked_width');
    if (!us.width || us.width < 20) us.width = 280;
    us.height = System.Gadget.Settings.read('undocked_height');
    if (!us.height || us.height < 60) us.height = 350;
  }
  Gadget.render();
}

Gadget.setFlyout = function() {
  System.Gadget.Flyout.file = 'flyout.html';
  
  if(System.Gadget.Flyout.show) {
    System.Gadget.Flyout.show = false;
  } else {
    System.Gadget.Flyout.show = true;
  }
}

Gadget.flyoutShowing = function() {
  window.setTimeout('System.Gadget.Flyout.document.parentWindow.flyoutShowing()', 100);
}

Gadget.flyoutHiding = function() {
  System.Gadget.Settings.write('replyTo', '');
}

Gadget.pageUnload = function() {
  window.detachEvent('onunload', Gadget.pageUnload);
  
  if(refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

Gadget.pageLoad = function() {
  window.detachEvent('onload', Gadget.pageLoad);
  window.attachEvent('onunload', Gadget.pageUnload);
  
  System.Gadget.Flyout.onShow = Gadget.flyoutShowing;
  System.Gadget.Flyout.onHide = Gadget.flyoutHiding;
  $('update').onclick = Gadget.setFlyout;
  $('reload').onclick = Gadget.refreshTimeline;
  
  System.Gadget.onDock = Gadget.dockStateChanged;
  System.Gadget.onUndock = Gadget.dockStateChanged;
  
  System.Gadget.settingsUI = 'settings.html';
  System.Gadget.onSettingsClosed = Gadget.settingsClosed;
  
  us = new Twigadge.Settings();
  us.read();
  
  Gadget.render();
  
  if (us.username != '') {
    window.setTimeout(function() { Gadget.refreshTimeline(); }, 3000);
  } else {
    window.setTimeout(function() {$('output').innerHTML = LOCAL.set_username; }, 3000);
  }
  refreshFeed(us);
}

Gadget.refreshTimeline = function() {
  if(refreshTimer) {
    window.clearTimeout(refreshTimer);
  }
  if (us.username != '') {
    Gadget.getFriendsTimeline();
  } else {
    $('output').innerHTML = LOCAL.set_username;
  }
  refreshTimer = setTimeout(Gadget.refreshTimeline, 1000 * 60 * us.interval);
}

window.attachEvent('onload', Gadget.pageLoad);
