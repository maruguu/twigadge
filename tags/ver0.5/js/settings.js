/*
 *  settings.js
 */

//  temporary value for setting
var temp_user;
var temp_pass;
var temp_interval;
var temp_post;
var temp_width;
var temp_height;

var previous_page;

// Initialize
function settingsInit() {
  window.detachEvent('onload', settingsInit);
  System.Gadget.onSettingsClosing = settingsClosing;
  
  // Read from file
  temp_user = System.Gadget.Settings.read('username');
  temp_pass = System.Gadget.Settings.read('passwords');
  temp_interval = System.Gadget.Settings.read('interval');
  if(temp_interval == '') temp_interval = '5';
  temp_post = (System.Gadget.Settings.read('post') == 'true');
  if(System.Gadget.docked) {
    temp_width = System.Gadget.Settings.read('docked_width');
    if(temp_width == '') temp_width = '130';
    temp_height = System.Gadget.Settings.read('docked_height');
    if(temp_height == '') temp_height = '200';
  } else {
    temp_width = System.Gadget.Settings.read('undocked_width');
    if(temp_width == '') temp_width = '280';
    temp_height = System.Gadget.Settings.read('undocked_height');
    if(temp_height == '') temp_height = '350';
  }
  
  
  previous_page = 0;
  showtab(0);
}


function saveSettings(page) {
  if(page == 0) {
    temp_user = $('user').value;
    temp_pass = $('pass').value;
    temp_interval = $('interval').value;
    temp_post = $('post').checked;
  } else if(page == 1) {
    temp_width = $('width').value;
    temp_height = $('height').value;
  }
}

// Closing
function settingsClosing(event) {
  if(event.closeAction == event.Action.commit) {
    saveSettings(previous_page);
    
    var i;
    System.Gadget.Settings.write('username', temp_user);
    System.Gadget.Settings.write('passwords', temp_pass);
    i = parseInt(temp_interval);
    if(isNaN(i) || i <= 0) i = 5;
    System.Gadget.Settings.write('interval', i);
    System.Gadget.Settings.write('post', (temp_post) ? 'true' : 'false');
    if(System.Gadget.docked) {
      i = parseInt(temp_width);
      if(isNaN(i) || i < 20) i = 130;
      System.Gadget.Settings.write('docked_width', i);
      i = parseInt(temp_height);
      if(isNaN(i) || i < 40) i = 200;
      System.Gadget.Settings.write('docked_height', i);
    } else {
      i = parseInt(temp_width);
      if(isNaN(i) || i < 20) i = 280;
      System.Gadget.Settings.write('undocked_width', i);
      i = parseInt(temp_height);
      if(isNaN(i) || i < 40) i = 350;
      System.Gadget.Settings.write('undocked_height', i);
    }
  }
}

// Settings UI
function showtab(page) {
  c = (page < 0) ? "" : pages[page];
  
  // Save settings
  if(previous_page != page) {
    saveSettings(previous_page);
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
    $('user').value = temp_user;
    $('pass').value = temp_pass;
    $('interval').value = temp_interval;
    $('post').checked = temp_post;
  } else if(page == 1) {
    $('width').value = temp_width;
    $('height').value = temp_height;
  }
  
  
  previous_page = page;
}

window.attachEvent('onload', settingsInit);

