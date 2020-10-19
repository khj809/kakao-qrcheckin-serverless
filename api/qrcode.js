const fetch = require('node-fetch');
const qr = require('qr-image');
const USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK 9.0.3';
 
module.exports = async (req, res) => {
  if (req.method !== 'POST'){
    res.status(403);
    res.send({'message': `Method "${req.method}" is not allowed`});
    return;
  }

  const { _kawlt } = req.body;
  if (_kawlt === undefined){
    res.status(400);
    res.send({'message': `_kawlt is not provided`});
    return;
  }

  const headers = {
    'Cookie': `_kawlt=${encodeURIComponent(_kawlt)}`,
    'User-Agent': USER_AGENT
  };

  try {
    const html = await (await fetch('https://accounts.kakao.com/qr_check_in', { headers })).text();
    const { groups: { token } } = html.match(/"token":\s*"(?<token>.+?)"/);

    const json = await (await fetch(`https://accounts.kakao.com/qr_check_in/request_qr_data.json?lang=ko&os=ios&webview_v=2&is_under_age=false&token=${token}`, { headers })).json();

    const qrImage = qr.imageSync(json.qr_data);
    res.setHeader('Content-Type', 'image/png');
    res.send(qrImage); 
  }
  catch(e){
    console.log(e);
    res.status(400);
    res.send({'message': e.detail});
  }
}
