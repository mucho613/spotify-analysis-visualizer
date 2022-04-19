import { useState } from "react";
import { InformationDisplay } from "../../display/components";
import { useSpotifyPlaybackSDK } from "../hooks/useSpotifyPlaybackSDK";
import './index.css';

type Props = {
  token: string;
}

export type PlayStartPosition = {
  position: number;
  startTime: number;
}

function WebPlayer(props: Props) {
  const [playbackTrack, setPlaybackTrack] = useState<Spotify.Track | undefined>(undefined);
  const [playStartPosition, setPlayStartPosition] = useState<PlayStartPosition | undefined>(undefined);

  const handleClick = async (player: Spotify.Player) => {
    await player.togglePlay();
  }

  const handlePlayerStateChanged = (track: Spotify.Track) => setPlaybackTrack(track);

  const { player } = useSpotifyPlaybackSDK({
    token: props.token,
    onPlayerStateChanged: handlePlayerStateChanged
  });

  return (<>
    {player &&
      <>
        <div className="player-ui">
          <button onClick={() => handleClick(player)}>Play</button>
          <button onClick={() => {
            player.seek(0)
            setPlayStartPosition({ position: 0, startTime: Date.now() });
          }}>Seek to top</button>
        </div>
        <InformationDisplay token={props.token} track={playbackTrack} playStartPosition={playStartPosition} />
      </>
    }

  </>);
}

export default WebPlayer;
