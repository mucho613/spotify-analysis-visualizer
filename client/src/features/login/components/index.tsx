import { useEffect, useState } from "react";
import './index.css';

type Props = {
}

function LoginButton(props: Props) {
  const handleClick = () => {

  }

  useEffect(() => {
  });

  return <>
    <a className="login-spotify" href="http://localhost:5000/auth/login" >
      Login with Spotify
    </a>
  </>
}

export default LoginButton;
