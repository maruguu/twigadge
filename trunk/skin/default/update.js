/*
 * update.js
 */
var UpdateFlyout = function() {
  var maxLength = 140;
  var updating = false;
  
  return {
    /**
     * initialization on page is loaded
     */
    pageLoad: function() {
      window.detachEvent('onload', UpdateFlyout.pageLoad);
      
      $("#update-text").bind("keydown", UpdateFlyout.submitOnCtrlEnter);
      $("#update-text").bind("keyup", UpdateFlyout.updateLength);
      $("#update-button").bind("click", UpdateFlyout.submitStatus);
    },
    
    /**
     * Submit on ctrl+Enter
     */
    submitOnCtrlEnter: function() {
      if(event.ctrlKey && event.keyCode == 13) {
        UpdateFlyout.submitStatus();
      }
    },
    
    /**
     * submit current status
     */
    submitStatus: function() {
      if(updating) {
        return ;
      } else {
        updating = true;
      }
      
      var len = $("#update-text").val().length;
      if(len == 0) {
        $("#status").empty();
        $("#status").append(Local.emptyStatus);
        updating = false;
        return ;
      }
      
      setTimeout(function() {
        $("#update-button").attr("disabled","disabled");
        System.Gadget.document.parentWindow.Twigadge.updateStatus($("#update-text").val(), $("#in-reply-to").text()); 
      }, 1);
    },
    
    /**
     * update the input size
     */
    updateLength: function() {
      var str = $("#update-text").val().length;
      var len = parseInt(str, 10);
      if(len > maxLength) {
        str = '<font color="#ff0000">' + str + '</font>';
      }
      $("#string-length").empty();
      $("#string-length").append(str + ' / ' + maxLength);
      $("#status").empty();
    },
    
    dummy: function() {}
  };
}();

window.attachEvent('onload', UpdateFlyout.pageLoad);
