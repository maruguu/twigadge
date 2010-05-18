/*
 * local_settings.js
 *   l10n for settings.html
 */
var menu = new Array();
menu[0] = '<a class="tab" onClick="Settings.showTab(0)">通信</a>';
menu[1] = '<a class="tab" onClick="Settings.showTab(1)">表示</a>';
menu[2] = '<a class="tab" onClick="Settings.showTab(2)">その他</a>';
menu[3] = '<a class="tab" onClick="Settings.showTab(3)">バージョン</a>';

var pages = new Array();
pages[0] = '<p>認証:<br><br><div id="authorization"></div></p><br><p>更新間隔(分):<br><input type="text" id="interval" value="" class="input-box" /></p>';

pages[1] = '<table cellpadding="0" cellspacing="0"><tr><td Colspan="2">ウィンドウサイズ</td></tr><tr><td width="35px">幅:</td><td><input type="text" id="width" value="" width="160px" /></td></tr><tr><td width="35px">高さ:</td><td><input type="text" id="height" value="" width="160px" /></td></tr><tr><td Colspan="2" style="width:30%" style="padding:0px 5px 0px 5px;"><input type="checkbox" id="scroller" value="" />リロード時に先頭に戻る</td></tr><tr><td Colspan="2" style="width:30%" style="padding:0px 5px 0px 5px;"><input type="checkbox" id="fixed" value="" />発言の表示サイズを固定</td></tr></table>';
pages[2] = '<table cellpadding="0" cellspacing="0"><tr><td style="padding:5px 5px 5px 5px;"><input type="checkbox" id="buzz_enable" value="" />Buzztter対応</td></tr><tr><td style="padding-left:25px;">更新間隔(分):</td></tr><tr><td style="padding-left:25px;"><input type="text" id="buzz_interval" value="" width="160px" /></td></tr></table><p>保持する発言数:<br><input type="text" id="queueSize" value="" class="input-box" /></p>';
pages[3] = '<center><img src="icon.png" /><br /><b>twigadge<div id="version"></div></b><br /><a href="http://tomatomax.net/twigadge" target="_blank">http://tomatomax.net/twigadge</a><br /><input type="checkbox" id="check_ver" value="" />起動時に最新版があるか確認</center>';

var LocalSettings = {};
LocalSettings.authStatus = '認証済み - ';
LocalSettings.notAuthorized = '未認証';
