/*
 * local_settings.js
 *   l10n for settings.html
 */
var menu = new Array();
menu[0] = '<a class="tab" onClick="Settings.showtab(0)">通信</a>';
menu[1] = '<a class="tab" onClick="Settings.showtab(1)">表示</a>';
menu[2] = '<a class="tab" onClick="Settings.showtab(2)">その他</a>';
menu[3] = '<a class="tab" onClick="Settings.showtab(3)">バージョン</a>';

var pages = new Array();
pages[0] = '<p>ユーザ名:<br><input type="text" id="user" value="" class="input-box" /></p><p>パスワード:<br><input type="password" id="pass" value="" class="input-box" /></p><p>更新間隔(分):<br><input type="text" id="interval" value="" class="input-box" /></p><p>DMの更新間隔(分):<br><input type="text" id="intervalDM" value="" class="input-box" /></p><table cellpadding="0" cellspacing="0"><tr><td style="padding:5px 5px 5px 5px;"><input type="checkbox" name="reply" value="" />起動時に返信を取得</td></tr></table>';

pages[1] = '<table cellpadding="0" cellspacing="0"><tr><td Colspan="2">ウィンドウサイズ</td></tr><tr><td width="35px">幅:</td><td><input type="text" id="width" value="" width="160px" /></td></tr><tr><td width="35px">高さ:</td><td><input type="text" id="height" value="" width="160px" /></td></tr><tr><td Colspan="2" style="width:30%" style="padding:0px 5px 0px 5px;"><input type="checkbox" name="scroller" value="" />リロード時に先頭に戻る</td></tr><tr><td Colspan="2" style="width:30%" style="padding:0px 5px 0px 5px;"><input type="checkbox" name="fixed" value="" />発言の表示サイズを固定</td></tr><tr><td Colspan="2" style="width:30%" style="padding:0px 5px 0px 5px;"><input type="checkbox" name="heart" value="" />ハート対応</td></tr></table>';
pages[2] = '<table cellpadding="0" cellspacing="0"><tr><td style="padding:5px 5px 5px 5px;"><input type="checkbox" name="buzz_enable" value="" />Buzztter対応</td></tr><tr><td style="padding-left:25px;">更新間隔(分):</td></tr><tr><td style="padding-left:25px;"><input type="text" id="buzz_interval" value="" width="160px" /></td></tr></table><p>保持しておく発言数:<br><input type="text" id="queueSize" value="" class="input-box" /></p>';
pages[3] = '<center><img src="images/icon.png" /><br /><b>twigadge<div id="version"></div></b><br /><a href="http://code.google.com/p/twigadge/" target="_blank">http://code.google.com/p/twigadge/</a><br /><input type="checkbox" name="check_ver" value="" />起動時に最新版があるか確認</center>';
