/*
 * flyout_comment.js
 *   flyout for comment
 */
function flyoutShowing() {
  var sgf = System.Gadget.Flyout;
  var sgs = System.Gadget.Settings;
  var scr_name = sgs.read('show_scrname');
  var username = sgs.read('show_username');
  if(username != '') {
    $('username').innerHTML = '<a class="twitter" href="http://www.twitter.com/' + scr_name+ ' ">' + username + '</a>';
    $('web').innerHTML = '<a class="twitter" href="http://www.twitter.com/' + scr_name+ ' ">Web</a>';
  } else {
    $('username').innerHTML = 'unknown';
  }
  var image = sgs.read('show_image');
  if(image != '') {
    $('profile-image').innerHTML = '<img src="' + image + '"/>';
  } else {
    $('profile-image').innerHTML = '<img alt="Not found" />';
  }
  var text = sgs.read('show_status');
  if(text != '') {
    $('comment').innerHTML = text;
  } else {
    $('comment').innerHTML = 'undefined';
  }
  
  sgf.document.body.style.height = document.documentElement.scrollHeight;
}

//---- Select Text ----
// http://www.codeproject.com/KB/gadgets/gadgettips.aspx?msg=1966061
var selectionEntry; // stores the position where user clicked 
var selectionRange; // the actual selection which gets highlighted

function StartSelection()
{
  if (event.button == 1) {
    selectionEntry = document.body.createTextRange();
    try { 
      selectionEntry.moveToPoint(event.clientX, event.clientY);
    } catch (invalidPoint) { 
      return;
    }
    selectionRange = selectionEntry.duplicate();
  }
}

function TrackSelection()
{
  if (event.button == 1) {
    var mousePoint = document.body.createTextRange();
    try { 
      mousePoint.moveToPoint(event.clientX, event.clientY);
    } catch (invalidPoint) { 
      return; 
    } 
   
    var start;
    try { 
      start = mousePoint.compareEndPoints('StartToStart', selectionEntry);
    } catch (uncomparablePoints) { 
      return; 
    }
    if (start == -1)
      selectionRange.setEndPoint('StartToStart', mousePoint);
    else
      selectionRange.setEndPoint('EndToStart', mousePoint);
   
    selectionRange.select(); // highlights the range
  } 
}

function copyText() {
  if ((document.selection != null) && (document.selection.type == "Text")) {
    $('output').innerHTML = "Copy : " + selectionRange.text.substring(0, 10);
    if(selectionRange.text.length > 10) {
      $('output').innerHTML += "..."
    }
    window.clipboardData.setData("text", selectionRange.text);
  }
}
