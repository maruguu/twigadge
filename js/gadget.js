/*
 * gadget.js
 *   main module - twigadge
 */
var Gadget = {}; // Namespace
var us;         // User Settings
var json;       // JSON format
var refreshTimer;
var flyout_type = '';

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
  var sg = System.Gadget;
  if(sg.Flyout.show && (flyout_type == 'comment')) {
    System.Gadget.Flyout.show = false;
  } else if(sg.Flyout.show && (flyout_type == 'send')) {
    var uptext = sg.Flyout.document.getElementById('update-text');
    uptext.value += '@' + name + ' ';
    uptext.focus();
  } else {
    flyout_type = 'send';
    sg.Settings.write('replyTo', name);
    Gadget.setFlyout();
  }
}

function showComment(n) {
  var sg = System.Gadget;
  var sgf = sg.Flyout;
  if(sgf.show) {
    sgf.show = false;
  } else {
    flyout_type = 'comment';
    var scr_name = sg.document.getElementById('scr_name' + n);
    sg.Settings.write('show_scrname', scr_name.innerHTML);
    var name = sg.document.getElementById('name' + n);
    sg.Settings.write('show_username', name.innerHTML);
    var image = sg.document.getElementById('user_image' + n);
    sg.Settings.write('show_image', image.background);
    var text = sg.document.getElementById('text' + n);
    sg.Settings.write('show_status', text.innerHTML);
    sgf.file = 'flyout_comment.html';
    sgf.onShow = Gadget.flyoutShowing;
    sgf.onHide = Gadget.flyoutHiding;
    sgf.show = true;
    sgf.document.focus();
  }
}

//-------------------------------------

Gadget.render = function() {
  var httpURL = /(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g; // '
  var txt = '';
  var w = (us.width - 22); // <td width=
  var iSize = (System.Gadget.docked) ? '20' : '48'; // Image size
  var bgc;
  var fixedstr = (us.fixed) ? 'style="height:42px; overflow:hidden;"' : '';
  document.body.style.width = us.width + 'px';
  document.body.style.height = us.height + 'px';
  
  $('gadget').innerHTML = '<div class="render" id="render"></div>';
  $('render').style.height = (us.height - 30) + 'px';
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
      if(us.buzztter.enable) body = BuzzHighlight(body);
      
      var comment = '';
      comment += '<p class="comment" '+ fixedstr + '>';
      comment += '<table cellspacing="0" cellpadding="0">';
      comment += '<tr><td width="' + w + '" ' + bgc + '>';
      comment += '<div class="scr_name"';
      comment += ' onclick="showComment(XXXX)" >';
      comment += '<table class="user_image" id="user_imageXXXX"';
      comment += ' background="IMG"';
      comment += ' width="' + iSize + '" height="48" align="left">';
      comment += '<tr><td></td></tr></table>';
      comment += '</div>';
      comment += '<b><div class="scr_name" id="scr_nameXXXX"';
      comment += ' onclick="reply(\'SCRNAME\')"';
      comment += ' onmouseover="changeBgColor(\'scr_nameXXXX\')"';
      comment += ' onmouseout="backBgColor(\'scr_nameXXXX\')" >';
      comment += 'SCRNAME</div><div id="nameXXXX" style="display: none;">NAME</div></b>';
      comment += '<div id="textXXXX">' + body + '</div>';
      comment += '</td></tr></table>';
      comment += '</p>';
      
      comment = comment.replace(/IMG/g, json[i].user.profile_image_url);
      comment = comment.replace(/SCRNAME/g, json[i].user.screen_name);
      comment = comment.replace(/XXXX/g, i);
      comment = comment.replace(/NAME/, json[i].user.name);
      txt += comment;
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
    refreshFeed(us);
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
  System.Gadget.Flyout.onShow = Gadget.flyoutShowing;
  System.Gadget.Flyout.onHide = Gadget.flyoutHiding;
  
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

// ---- Check version ----
Gadget.checkVersion = function() {
  var url = "http://code.google.com/p/twigadge/wiki/ChangeLog";
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader('If-Modified-Since', "Sat, 1 Jan 2000 00:00:00 GMT");
  xhr.onreadystatechange = function(istimeout) {
    if(xhr && xhr.readyState == 4 && xhr.status == 200) {
      var ar = xhr.responseText.match(/Version\s(\d\.\d(\.\d)?(\.\d)?)/);
      if(ar != null) {
        var latest = RegExp.$1;
        var latest_version = latest;
        var ver = System.Gadget.version;
        while(latest.match(/(\d)/) != null) {
          n = RegExp.$1;
          latest = RegExp.rightContext;
          if(ver.match(/(\d)/) == null) {
            Gadget.confirmToOpenWeb(latest_version);
            break;
          }
          m = RegExp.$1;
          ver = RegExp.rightContext;
          if(n > m) {
            Gadget.confirmToOpenWeb(latest_version);
            break;
          } else if (n < m){
            break;
          }
        } 
      }
      $('output').innerHTML = LOCAL.check_finish;
    } else if(xhr && xhr.readyState == 4) {
      $('output').innerHTML = LOCAL.check + ":" + xhr.status + ':' + xhr.statusText;
    } else if(xhr && istimeout == 'timeout') {
      $('output').innerHTML = LOCAL.check_timeout;
    } else if(xhr && xhr.readyState == 3) {
      $('output').innerHTML = LOCAL.check_message;
    } else {
    }
  };
  xhr.send('');
  $('output').innerHTML = LOCAL.check_start;
}

Gadget.confirmToOpenWeb = function(latest_version) {
  if(confirm(LOCAL.check_latest + "\n\nVersion " + System.Gadget.version + " -> Version " + latest_version + "\n\n" + LOCAL.check_to_update)) {
    open("http://code.google.com/p/twigadge/");
  }
}

// ---- Initial function ----
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
  if(us.check_ver) {
    Gadget.checkVersion();
  }
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
