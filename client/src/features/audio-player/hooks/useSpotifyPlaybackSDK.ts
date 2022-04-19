import { useEffect, useState } from "react";

type Props = {
  token: string;
  onPlayerStateChanged: (track: Spotify.Track) => void;
}

export const useSpotifyPlaybackSDK = (props: Props) => {
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb: any) => { cb(props.token); },
        volume: 0.2
      });

      player.addListener('ready', ({ device_id }: any) => {
        console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', ({ device_id }: any) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('initialization_error', ({ message }: any) => {
        console.error(message);
      });

      player.addListener('authentication_error', ({ message }: any) => {
        console.error(message);
      });

      player.addListener('account_error', ({ message }: any) => {
        console.error(message);
      });

      player.addListener('player_state_changed', ({
        position,
        duration,
        track_window: { current_track }
      }) => {
        // console.log('Playing', current_track, position);
        props.onPlayerStateChanged(current_track);
      });

      player.connect();

      setPlayer(player);
    };
  }, [props]);

  return {
    player
  }
}
