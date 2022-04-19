import request from 'request';
import { Config } from "..";

export const handleCallback = (req: { query: { code: any; }; }, res: { redirect: (arg0: string) => void; }) => {
  const code = req.query.code;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: "http://localhost:3000/auth/callback",
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(Config.SPOTIFY_CLIENT_ID + ':' + Config.SPOTIFY_CLIENT_SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      Config.ACCESS_TOKEN = body.access_token;
      res.redirect('/')
    }
  });
}
