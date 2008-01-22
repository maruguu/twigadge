/*
 * twigadge.js
 *   
 */

var Twigadge = {}; // Namespace twigadge

// ------------------------------------
// CLASS Settings
Twigadge.Settings = function() {
  this.username = '';
  this.password = '';
  this.interval = 5;
  this.post = false;
  this.width = 130;
  this.height = 200;
  this.scroller = true;
  this.buzztter = {};
  this.buzztter.enable = true;
  this.buzztter.interval = 30;
}


Twigadge.Settings.prototype.read = function() {
  this.username = System.Gadget.Settings.read('username');
  if (!this.username) username = '';
  this.password = System.Gadget.Settings.read('password');
  if (!this.password) this.password = '';
  this.interval = System.Gadget.Settings.read('interval');
  if (!this.interval || this.interval <= 0) this.interval = 5;
  this.post = (System.Gadget.Settings.read('post') == 'true') ? true : false;
  
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
  this.scroller = (System.Gadget.Settings.read('scroller') == 'true') ? true : false;
}

Twigadge.Settings.prototype.write = function() {
    System.Gadget.Settings.write('username', this.username);
    System.Gadget.Settings.write('password', this.password);
    var i = parseInt(this.interval);
    if(isNaN(i) || i <= 0) i = 5;
    System.Gadget.Settings.write('interval', i);
    System.Gadget.Settings.write('post', (this.post) ? 'true' : 'false');
    if(System.Gadget.docked) {
      i = parseInt(this.width);
      if(isNaN(i) || i < 20) i = 130;
      System.Gadget.Settings.write('docked_width', i);
      i = parseInt(this.height);
      if(isNaN(i) || i < 60) i = 200;
      System.Gadget.Settings.write('docked_height', i);
    } else {
      i = parseInt(this.width);
      if(isNaN(i) || i < 20) i = 280;
      System.Gadget.Settings.write('undocked_width', i);
      i = parseInt(this.height);
      if(isNaN(i) || i < 60) i = 350;
      System.Gadget.Settings.write('undocked_height', i);
    }
    System.Gadget.Settings.write('scroller', (this.scroller)?'true' : 'false');
}
