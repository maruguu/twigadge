/*
 *  settings.js
 *  (c)2007 maruguu
 */

// Initialize
function settingsInit() {
  window.detachEvent('onload', settingsInit);
  System.Gadget.onSettingsClosing = settingsClosing;
  
  $('user').value = System.Gadget.Settings.read('username');
  $('pass').value = System.Gadget.Settings.read('passwords');
  $('interval').value = System.Gadget.Settings.read('interval');
  if($('interval').value == '') $('interval').value = '5';
}

// Closing
function settingsClosing(event) {
  if(event.closeAction == event.Action.commit) {
    var i = parseInt($('interval').value);
    if(isNaN(i) || i <= 0) {
      i = 5;
    }
    System.Gadget.Settings.write('username', $('user').value);
    System.Gadget.Settings.write('passwords', $('pass').value);
    System.Gadget.Settings.write('interval', i);
  }
}

window.attachEvent('onload', settingsInit);

