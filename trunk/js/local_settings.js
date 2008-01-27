/*
 * local_settings.js
 *   l10n for settings.html
 */
var menu = new Array();
menu[0] = '<a class="tab" onClick="Settings.showtab(0)">Connection</a>';
menu[1] = '<a class="tab" onClick="Settings.showtab(1)">View</a>';
menu[2] = '<a class="tab" onClick="Settings.showtab(2)">Etc.</a>';
menu[3] = '<a class="tab" onClick="Settings.showtab(3)">Version</a>';

var pages = new Array();
pages[0] = '<p>User name:<br><input type="text" id="user" value="" class="input-box" /></p><p>Password:<br><input type="password" id="pass" value="" class="input-box" /></p><p>Refresh interval(min):<br><input type="text" id="interval" value="" class="input-box" /></p><table cellpadding="0" cellspacing="0"><tr><td style="padding:5px 5px 5px 5px;"><input type="checkbox" name="post" value="" />Use "POST" to refresh timeline</td></tr></table>';

pages[1] = '<table cellpadding="0" cellspacing="0"><tr><td Colspan="2">Size</td></tr><tr><td width="35px">Width:</td><td><input type="text" id="width" value="" width="160px" /></td></tr><tr><td width="35px">Height:</td><td><input type="text" id="height" value="" width="160px" /></td></tr><tr><td Colspan="2" style="width:30%" style="padding:0px 5px 0px 5px;"><input type="checkbox" name="scroller" value="" />Rewind to top on reload</td></tr><tr><td Colspan="2" style="width:30%" style="padding:0px 5px 0px 5px;"><input type="checkbox" name="fixed" value="" />Use fix-style box</td></tr></table>';
pages[2] = '<table cellpadding="0" cellspacing="0"><tr><td style="padding:5px 5px 5px 5px;"><input type="checkbox" name="buzz_enable" value="" />Read buzzword from Buzztter</td></tr><tr><td style="padding-left:25px;">Refresh interval(min):</td></tr><tr><td style="padding-left:25px;"><input type="text" id="buzz_interval" value="" width="160px" /></td></tr></table>';
pages[3] = '<center><img src="images/icon.png" /><br /><b>twigadge<div id="version"></div></b><br /><a href="http://code.google.com/p/twigadge/" target="_blank">http://code.google.com/p/twigadge/</a><br /><input type="checkbox" name="check_ver" value="" />Check latest version on booting</center>';
