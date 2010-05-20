/*
 * twit.js
 */

function favorite(id) {
  setTimeout(function() { 
    var p = System.Gadget.document.parentWindow;
    p.ViewManager.updateFavStatusInTwitFlyout(p.Twigadge.FAVORITE.CHANGING);
    p.ViewManager.favorite(id); 
  }, 1);
}

function unfavorite(id) {
  setTimeout(function() { 
    var p = System.Gadget.document.parentWindow;
    p.ViewManager.updateFavStatusInTwitFlyout(p.Twigadge.FAVORITE.CHANGING);
    p.ViewManager.unfavorite(id);
  }, 1);
}

function retweet(id) {
  setTimeout(function() { System.Gadget.document.parentWindow.ViewManager.retweet(id); }, 1);
}

function rt_format(id) {
  setTimeout(function() { System.Gadget.document.parentWindow.ViewManager.rt_format(id); }, 1);
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
    var doc = System.Gadget.Flyout.document;
    var op = doc.getElementById('output');
    op.innerHTML = "Copy : " + selectionRange.text.substring(0, 5);
    if(selectionRange.text.length > 5) {
      op.innerHTML += "..."
    }
    window.clipboardData.setData("text", selectionRange.text);
  }
}
