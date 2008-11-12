/*
 * sendmessage.js
 */

var SendMessage = function() {
  var maxLength = 140;
  var updating = false;
  
  return {
    updateStatus: function() {
      if(updating) return ;
      
      var len = $('update-text').value.length;
      if(len == 0) {
        $('status').innerHTML = Local.messagesizeShort;
        return ;
      }
      updating = true;
      setTimeout('System.Gadget.document.parentWindow.Twigadge.updateStatus()', 1);
    },
    
    updateLength: function() {
      var str = $('update-text').value.length;
      var len = parseInt(str, 10);
      if(len > maxLength) {
        str = '<font color="#ff0000">' + str + '</font>';
      }
      $('string-length').innerHTML = str + ' / ' + maxLength;
      $('status').innerHTML = '';
    },
    
    submitOnCtrlEnter: function() {
      if(event.ctrlKey && event.keyCode == 13) {
        SendMessage.updateStatus();
      }
    },
    
    pageLoad: function() {
      window.detachEvent('onload', SendMessage.pageLoad);
      
      $('update-text').onkeydown = SendMessage.submitOnCtrlEnter;
      $('update-text').onkeyup = SendMessage.updateLength;
      $('update-button').onclick = SendMessage.updateStatus;
    }
  };
}();

window.attachEvent('onload', SendMessage.pageLoad);
