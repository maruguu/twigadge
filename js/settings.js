/*
 *  settings.js
 *  Copyright(c) 2007-2008 maruguu
 */

//  temporary value for setting
var temp_user;
var temp_pass;
var temp_interval;
var temp_post;

var previous_page;

// UI Data
var pages = new Array();
pages[0] = '<p>ユーザ名:<br><input type="text" id="user" value="" class="input-box" /></p><p>パスワード:<br><input type="password" id="pass" value="" class="input-box" /></p><p>更新間隔(分):<br><input type="text" id="interval" value="" class="input-box" /></p><tr><td style="width:30%" style="padding-top:3px"><input type="checkbox" name="post" value="" />ステータスの更新にPOSTを使う</td></tr>';

pages[1] = '仮置き1';
pages[2] = '仮置き2';

var menu = new Array();
menu[0] = '<a class="tab" onClick="showtab(0)">通信</a>';
menu[1] = '<a class="tab" onClick="showtab(1)">表示</a>';
menu[2] = '<a class="tab" onClick="showtab(2)">その他</a>';

// Initialize
function settingsInit() {
  window.detachEvent('onload', settingsInit);
  System.Gadget.onSettingsClosing = settingsClosing;
  
  temp_user = System.Gadget.Settings.read('username');
  temp_pass = System.Gadget.Settings.read('passwords');
  temp_interval = System.Gadget.Settings.read('interval');
  if(temp_interval == '') temp_interval = '5';
  temp_post = (System.Gadget.Settings.read('post') == 'true');
  
  previous_page = 0;
  showtab(0);
}


function saveSettings(page) {
  if(page == 0) {
    temp_user = $('user').value;
    temp_pass = $('pass').value;
    temp_interval = $('interval').value;
    temp_post = $('post').checked;
  }
}

// Closing
function settingsClosing(event) {
  if(event.closeAction == event.Action.commit) {
    saveSettings(previous_page);
    
    var i = parseInt(temp_interval);
    if(isNaN(i) || i <= 0) {
      i = 5;
    }
    var p = (temp_post) ? 'true' : 'false'; 
    System.Gadget.Settings.write('username', temp_user);
    System.Gadget.Settings.write('passwords', temp_pass);
    System.Gadget.Settings.write('interval', i);
    System.Gadget.Settings.write('post', p);
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
  }
  
  
  previous_page = page;
}

window.attachEvent('onload', settingsInit);

