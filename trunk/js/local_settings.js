/*
 * local_settings.js
 *   l10n for settings.html
 */
var menu = new Array();
menu[0] = '<a class="tab" onClick="showtab(0)">通信</a>';
menu[1] = '<a class="tab" onClick="showtab(1)">表示</a>';
//menu[2] = '<a class="tab" onClick="showtab(2)">その他</a>';

var pages = new Array();
pages[0] = '<p>ユーザ名:<br><input type="text" id="user" value="" class="input-box" /></p><p>パスワード:<br><input type="password" id="pass" value="" class="input-box" /></p><p>更新間隔(分):<br><input type="text" id="interval" value="" class="input-box" /></p><tr><td style="width:30%" style="padding-top:3px"><input type="checkbox" name="post" value="" />ステータスの更新にPOSTを使う</td></tr>';

pages[1] = '<table cellpadding="0" cellspacing="0"><tr><td Colspan="2">ウィンドウサイズ</td></tr><tr><td width="35px">幅:</td><td><input type="text" id="width" value="" width="160px" /></td></tr><tr><td width="35px">高さ:</td><td><input type="text" id="height" value="" width="160px" /></td></tr><tr><td Colspan="2"><input type="checkbox" name="rollback" value="" />リロード時に先頭に戻る</td></tr></table>';
//pages[2] = '仮置き2';
