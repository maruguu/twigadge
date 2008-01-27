/*
 * flyout.js
 */
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
  if(len > max_length) {
    str = '<font color="#ff0000">' + str + '</font>';
  }
  $('string-length').innerHTML = str + ' / ' + max_length;
  $('status').innerHTML = '';
}

function updateStatus() {
  var len = parseInt(getByte($('update-text').value), 10);
  if(len == 0) {
    $('status').innerHTML = LOCAL.short_message;
    return ;
  }
  if(len > max_length) {
    $('status').innerHTML = LOCAL.long_message;
    return ;
  }
  
  window.setTimeout('System.Gadget.document.parentWindow.Gadget.updateStatus()', 1);
}

function flyoutShowing() {  
  var r = System.Gadget.Settings.read('replyTo');
  System.Gadget.Settings.write('replyTo', '');
  if(r != '') {
    $('update-text').value = '@' + r + ' ';
  }
  $('update-text').focus();
}
