function flyoutShowing() {
  var sgf = System.Gadget.Flyout;
  var sgs = System.Gadget.Settings;
  var scr_name = sgs.read('show_scrname');
  var username = sgs.read('show_username');
  if(username != '') {
    $('username').innerHTML = '<a class="twitter" href="http://www.twitter.com/' + scr_name+ ' ">' + username + '</a>';
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
