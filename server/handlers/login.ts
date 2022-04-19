import { Config } from "..";

export const handleLogin = (_req: any, res: { redirect: (arg0: string) => void; }) => {
  // eslint-disable-next-line no-multi-str
  const scope = "streaming \
               user-read-email \
               user-read-private";

  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: Config.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: "http://localhost:3000/auth/callback",
    state: state
  })

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
}

const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return [...new Array(length)].map(() => possible.charAt(Math.floor(Math.random() * possible.length))).join();
};
