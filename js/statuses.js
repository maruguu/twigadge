/*
 * statuses.js
 */
 
function favorite(id) {
  setTimeout(function() { System.Gadget.document.parentWindow.Twigadge.favorite(id); }, 1);
}

function unfavorite(id) {
  setTimeout(function() { System.Gadget.document.parentWindow.Twigadge.unfavorite(id); }, 1);
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
