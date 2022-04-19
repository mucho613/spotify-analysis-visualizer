import React, { useEffect, useState } from 'react';
import './App.css';
import WebPlayer from './features/audio-player/components';
import LoginButton from './features/login/components';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }
    getToken();
  }, []);

  return (
    <div className="App">
      <LoginButton />
      <WebPlayer token={token}/>
    </div>
  );
}

export default App;
