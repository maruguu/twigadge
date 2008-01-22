/*
 *  settings.js
 */
var Settings = {};
var us;
var previous_page;

// Initialize
Settings.init = function() {
  window.detachEvent('onload', Settings.init);
  System.Gadget.onSettingsClosing = Settings.closing;
  
  us = new Twigadge.Settings();
  us.read();
  previous_page = 0;
  Settings.showtab(0);
}


Settings.store = function(page) {
  if(page == 0) {
    us.username = $('user').value;
    us.password = $('pass').value;
    us.interval = $('interval').value;
    us.post = $('post').checked;
  } else if(page == 1) {
    us.width = $('width').value;
    us.height = $('height').value;
    us.scroller = $('scroller').checked;
  }
}

// Closing
Settings.closing = function(event) {
  if(event.closeAction == event.Action.commit) {
    Settings.store(previous_page);
    us.write();
  }
}

// Settings UI
Settings.showtab = function(page) {
  c = (page < 0) ? "" : pages[page];
  
  // Save settings
  if(previous_page != page) {
    Settings.store(previous_page);
  }
  // menu
  $('menu').innerHTML = "";
  for(i = 0; i < menu.length; i++) {
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
  $('content').innerHTML = c;
  if(page == 0) {
    $('user').value = us.username;
    $('pass').value = us.password;
    $('interval').value = us.interval;
    $('post').checked = us.post;
  } else if(page == 1) {
    $('width').value = us.width;
    $('height').value = us.height;
    $('scroller').checked = us.scroller;
  }
  previous_page = page;
}

window.attachEvent('onload', Settings.init);

