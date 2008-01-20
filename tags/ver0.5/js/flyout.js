var username;
var passwords;

var max_length = 140;

function submitOnEnter() {
  if(event.ctrlKey && event.keyCode == 13) {
    updateStatus();
  }
}

function getByte(text) { 
  var n;
  var count = 0;
  for (var i = 0; i < text.length; i++) { 
    n = escape(text.charAt(i)); 
    if (n.length < 4) {
      count++; 
    } else {
      count += 2;
    }
  }
  return count;
}

function updateLength() {
  var str = getByte($('update-text').value);
  var len = parseInt(str, 10);
  if(len > 140) {
    str = '<font color="#ff0000">' + str + '</font>';
  }
  $('string-length').innerHTML = str + ' / ' + max_length;
  $('status').innerHTML = '';
}

function updateStatus() {
  var len = parseInt(getByte($('update-text').value), 10);
  if(len == 0) {
    $('status').innerHTML = 'too short ...';
    return ;
  }
  if(len > 140) {
    $('status').innerHTML = 'too long ...';
    return ;
  }
  
  window.setTimeout('System.Gadget.document.parentWindow.updateStatus()', 1);
}

function flyoutShowing() {
  username = System.Gadget.Settings.read('username');
  passwords = System.Gadget.Settings.read('passwords');
  
  var r = System.Gadget.Settings.read('replyTo');
  System.Gadget.Settings.write('replyTo', '');
  if(r != '') {
    $('update-text').value = '@' + r + ' ';
    
  }
  $('update-text').focus();
}
