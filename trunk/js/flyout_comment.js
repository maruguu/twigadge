function flyoutShowing() {
  var sgs = System.Gadget.Settings;
  var username = sgs.read('show_username');
  if(username != '') {
    $('username').innerHTML = '<a href="http://www.twitter.com/' + username+ '/">' + username + '</a>';
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
  
  System.Gadget.Flyout.document.body.style.height = document.documentElement.scrollHeight;
}
