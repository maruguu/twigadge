/*
 * gadget.js
 *   main module - twigadge
 */
var username;
var passwords;
var interval;
var post;
var width;
var height;
var json;       // JSON format
var refreshTimer;

// Scroll to top
var scr_pos_y = 0;
var scr_count; 
function scroller(c){
  if(c == 1){
    scr_count = 0;
    scr_pos_y = $('gadget').scrollTop;
  }
  
  if(++scr_count <= 30){
    var ny = scr_pos_y - scr_pos_y * (scr_count / 30.0);
    $('gadget').scrollTop = ny;
    window.setTimeout('scroller()', 10);
  }
}

function updateStatus() {
  var url = 'http://twitter.com/statuses/update.json';
  var uptext = System.Gadget.Flyout.document.getElementById('update-text');
  var upbutton = System.Gadget.Flyout.document.getElementById('update-button');
  xhr = new XMLHttpRequest();
  xhr.open('POST', url, true, username, passwords);
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

function changeBgColor(id) {
  $(id).style.background = '#cec87a';
}

function backBgColor(id) {
   $(id).style.background = 'transparent';
}

function render() {
  var td_width;
  var img_size;
  
  $('gadget').innerHTML = '<div class="render" id="render"></div>';
  if (System.Gadget.docked) {
    document.body.style.width = width + 'px';
    document.body.style.height = height + 'px';
    $('render').style.height = (height - 20) + 'px';
    td_width = (width - 22);
    img_size = '20';
  } else {
    document.body.style.width = width + 'px';
    document.body.style.height = height + 'px';
    $('render').style.height = (height - 20) + 'px';
    td_width = (width - 22);
    img_size = '40';
  }
  
  var httpURL = /(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g;
  // '
  var bg_color;
  var r_text;
  if(json) {
    r_text = '';
    for(var i = 0; i < json.length; i++) {
      if(username != '') {
        if(json[i].text.indexOf('@' + username) >= 0) {
          bg_color = 'bgcolor="#7acec8" ';
        } else {
          bg_color = '';
        }
      }
      // URL replace
      
      var body = json[i].text.replace(httpURL, '<a href="$1">$1</a>');
      body = BuzzHighlight(body);
      
      r_text += '<p class="comment">';
      r_text += '<table cellspacing="0" cellpadding="0"><tr><td width="' + td_width + '" ' + bg_color + '>';
      r_text += '<div class="scr_name" onclick="reply(\'' + json[i].user.screen_name +'\')" >';
      r_text += '<img src=' + json[i].user.profile_image_url;
      r_text += ' alt="" width="' + img_size+ '" height="' + img_size + '" align="left" />';
      r_text += '</div>';
      r_text += '<b><div class="scr_name" id="scr_name' + i + '" onclick="reply(\'' + json[i].user.screen_name;
      r_text += '\')" onmouseover="changeBgColor(\'scr_name' + i + '\')" ';
      r_text += 'onmouseout="backBgColor(\'scr_name' + i + '\')" >';
      r_text += json[i].user.screen_name + '</div></b>';
      //r_text += json[i].text.replace(httpURL, '<a href="$1">$1</a>');
      r_text += body;
      r_text += '</td></tr></table>';
      r_text += '</p>';
    }
    $('render').innerHTML = r_text;
  }
  scroller(1);
}

function reply(name) {
  if(System.Gadget.Flyout.show) {
    var uptext = System.Gadget.Flyout.document.getElementById('update-text');
    uptext.value += '@' + name + ' ';
    uptext.focus();
  } else {
    System.Gadget.Settings.write('replyTo', name);
    setFlyout();
  }
}

function getFriendsTimeline() {
  var url = 'http://twitter.com/statuses/friends_timeline.json';
  var mtd;
  if(post) {
    mtd = 'POST';
  } else {
    mtd = 'GET';
  }
  var xhr = new XMLHttpRequest();
  xhr.open(mtd, url, true, username, passwords);
  xhr.setRequestHeader('If-Modified-Since', "Sat, 1 Jan 2000 00:00:00 GMT");
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function(istimeout) {
    if(xhr && xhr.readyState == 4 && xhr.status == 200) {
      json = eval('{table: ' + xhr.responseText + '}');
      $('output').innerHTML = LOCAL.recv_finish;
      render();
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

function settingsClosed(p_event) {
  if (p_event.closeAction == p_event.Action.commit) {
    settingsRead();
    refreshTimeline();
  }
}

function dockStateChanged() {
  if(System.Gadget.docked) {
    width = System.Gadget.Settings.read('docked_width');
    if (!width || width < 20) width = 130;
    height = System.Gadget.Settings.read('docked_height');
    if (!height || height < 40) height = 200;
  } else {
    width = System.Gadget.Settings.read('undocked_width');
    if (!width || width < 20) width = 280;
    height = System.Gadget.Settings.read('undocked_height');
    if (!height || height < 40) height = 350;
  }
  render();
}

function setFlyout() {
  System.Gadget.Flyout.file = 'flyout.html';
  
  if(System.Gadget.Flyout.show) {
    System.Gadget.Flyout.show = false;
  } else {
    System.Gadget.Flyout.show = true;
  }
}

function flyoutShowing() {
  window.setTimeout('System.Gadget.Flyout.document.parentWindow.flyoutShowing()', 100);
}

function flyoutHiding() {
  System.Gadget.Settings.write('replyTo', '');
}

function pageUnload() {
  window.detachEvent('onunload', pageUnload);
  
  if(refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

function pageLoad() {
  window.detachEvent('onload', pageLoad);
  window.attachEvent('onunload', pageUnload);
  
  System.Gadget.Flyout.onShow = flyoutShowing;
  System.Gadget.Flyout.onHide = flyoutHiding;
  $('update').onclick = setFlyout;
  $('reload').onclick = refreshTimeline;
  
  System.Gadget.onDock = dockStateChanged;
  System.Gadget.onUndock = dockStateChanged;
  
  System.Gadget.settingsUI = 'settings.html';
  System.Gadget.onSettingsClosed = settingsClosed;
  
  settingsRead();
  
  render();
  if (username != '') {
    window.setTimeout(function() { refreshTimeline(); }, 3000);
  } else {
    window.setTimeout(function() {$('output').innerHTML = LOCAL.set_username; }, 3000);
  }
  refreshFeed();
}

function refreshTimeline() {
  if(refreshTimer) {
    window.clearTimeout(refreshTimer);
  }
  if (username != '') {
    getFriendsTimeline();
  } else {
    $('output').innerHTML = LOCAL.set_username;
  }
  refreshTimer = setTimeout(refreshTimeline, 1000 * 60 * interval);
}

function settingsRead() {
  username = System.Gadget.Settings.read('username');
  if (!username) username = '';
  passwords = System.Gadget.Settings.read('passwords');
  if (!passwords) passwords = '';
  interval = System.Gadget.Settings.read('interval');
  if (!interval || interval <= 0) interval = 5;
  post = (System.Gadget.Settings.read('post') == 'true') ? true : false;
  
  if(System.Gadget.docked) {
    width = System.Gadget.Settings.read('docked_width');
    if (!width || width < 20) width = 130;
    height = System.Gadget.Settings.read('docked_height');
    if (!height || height < 40) height = 200;
  } else {
    width = System.Gadget.Settings.read('undocked_width');
    if (!width || width < 20) width = 280;
    height = System.Gadget.Settings.read('undocked_height');
    if (!height || height < 40) height = 350;
  }
}

window.attachEvent('onload', pageLoad);
