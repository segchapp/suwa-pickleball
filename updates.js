/*!
 * 最終更新日時の表示  updates.js  — 諏訪ピックルボールクラブ
 * ------------------------------------------------------------
 * 表示したい場所に次の2行を入れるだけ（index.html / reserve.html どちらでも可）
 *
 *   <div id="spc-updates"></div>
 *   <script src="updates.js" defer></script>
 *
 * 「出欠・日程データの最終変更」と「HP（GitHub）の最終更新」のうち、新しい方の日時を
 *  「最終更新 11/24(火) 18:30」の形で表示します。内容は表示しません。
 */
(function () {
  /* reserve.html と同じ Apps Script の URL（…/exec） */
  var GAS_URL = 'https://script.google.com/macros/s/AKfycbw6JoPTfEyRFA6YRWxyjNPLtsSzsdaZhMqMjUHLMSM2v2SvNZkrNle_aYPzP47G6XFE/exec';
  /* HP自体の更新日時もGitHubから拾う（不要なら空文字 '' に） */
  var GITHUB_REPO = 'segchapp/suwa-pickleball';

  var box = document.getElementById('spc-updates');
  if (!box) return;
  var DOW = ['日', '月', '火', '水', '木', '金', '土'];

  var st = document.createElement('style');
  st.textContent = '.spcu{font-size:.8rem;opacity:.75;text-align:right;margin:4px 0 8px;' +
    'font-variant-numeric:tabular-nums;min-height:1.2em}';
  document.head.appendChild(st);
  box.className = 'spcu';

  var gas = GAS_URL.indexOf('https://') === 0
    ? fetch(GAS_URL + (GAS_URL.indexOf('?') < 0 ? '?' : '&') + 'updated=1', { cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (j) { return j && j.ok && j.updated ? j.updated : null; })
        .catch(function () { return null; })
    : Promise.resolve(null);

  var gh = GITHUB_REPO
    ? fetch('https://api.github.com/repos/' + GITHUB_REPO + '/commits?per_page=1')
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (l) { return l[0] && l[0].commit ? l[0].commit.committer.date : null; })
        .catch(function () { return null; })
    : Promise.resolve(null);

  Promise.all([gas, gh]).then(function (r) {
    var t = [r[0], r[1]].filter(Boolean)
      .map(function (s) { return new Date(s); })
      .filter(function (d) { return !isNaN(d); })
      .sort(function (a, b) { return a - b; }).pop();
    if (t) box.textContent = '最終更新 ' + fmt(t);
  });

  function fmt(d) {
    var j = new Date(d.getTime() + (9 * 60 + d.getTimezoneOffset()) * 60000);   // 日本時間
    return (j.getMonth() + 1) + '/' + j.getDate() + '(' + DOW[j.getDay()] + ') ' +
      j.getHours() + ':' + ('0' + j.getMinutes()).slice(-2);
  }
})();
