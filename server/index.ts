import express from 'express'
import dotenv from 'dotenv';

import { handleLogin } from './handlers/login';
import { handleCallback } from './handlers/callback';
import { handleToken } from './handlers/token';

dotenv.config();

export const Config = {
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID ?? '',
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET ?? '',
  ACCESS_TOKEN: ''
}

const port = 5000;

const app = express();

app.get('/auth/login', handleLogin);
app.get('/auth/callback', handleCallback);
app.get('/auth/token', handleToken);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
