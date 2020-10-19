const USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK 9.0.3',

const fetch = require('node-fetch');
const qr = require('qr-image');

module.exports = async (req, res) => {
  const { _kawlt } = req.body;
  const headers = {
    'Cookie': `_kawlt=${encodeURIComponent(_kawlt)}`,
    'User-Agent': USER_AGENT
  };

  const html = await (await fetch('https://accounts.kakao.com/qr_check_in', { headers })).text();
  const { groups: { token } } = html.match(/"token":\s*"(?<token>.+?)"/);

  const json = await (await fetch(`https://accounts.kakao.com/qr_check_in/request_qr_data.json?lang=ko&os=ios&webview_v=2&is_under_age=false&token=${token}`, { headers })).json();

  const qrImage = qr.imageSync(json.qr_data);
  res.setHeader('Content-Type', 'image/png');
  res.send(qrImage); 
}
