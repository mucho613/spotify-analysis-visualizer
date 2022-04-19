import { useEffect, useState } from "react";
import { PlayStartPosition } from "../../audio-player/components";
import { useRequestAnimationFrame } from "../hooks/useRequestAnimationFrame";

type CurrentAnalysis = {
  index: number;
  analysis: SpotifyApi.Dur;
}

type CurrentPositionAnalysis = {
  section: CurrentAnalysis;
  bar: CurrentAnalysis;
  beat: CurrentAnalysis;
  segment: CurrentAnalysis;
  tatum: CurrentAnalysis;
}

type Props = {
  token: string;
  track?: Spotify.Track;
  playStartPosition?: PlayStartPosition;
}

export const InformationDisplay = (props: Props) => {
  const [analysis, setAnalysis] = useState<SpotifyApi.AudioAnalysisJSON | undefined>(undefined);
  const [currentAnalysis, setCurrentAnalysis] = useState<CurrentPositionAnalysis>();
  const [playTime, setPlayTime] = useState<Date>();

  const { track, token, playStartPosition } = props;

  const trackId = track?.id;

  useEffect(() => {
    async function getTrackAnalysis() {
      if(!trackId) return;
      const response = await fetch(`https://api.spotify.com/v1/audio-analysis/${trackId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const json: SpotifyApi.AudioAnalysisJSON = await response.json();
      setAnalysis(json);
    }
    getTrackAnalysis();
  }, [token, trackId]);

  const handleAnimation = () => {
    if(!playStartPosition) return;

    const playTimeSeconds = (playStartPosition.position + (Date.now() - playStartPosition.startTime)) / 1000;

    const range = (dur: SpotifyApi.Dur) => {
      return dur.start + dur.duration;
    }

    if(!analysis) return;

    const sectionIndex = analysis.sections.findIndex(section => range(section) > playTimeSeconds);
    const barIndex = analysis.bars.findIndex(bar => range(bar) > playTimeSeconds);
    const beatIndex = analysis.beats.findIndex(beat => range(beat) > playTimeSeconds);
    const segmentIndex = analysis.segments.findIndex(segment => range(segment) > playTimeSeconds);
    const tatumIndex = analysis.tatums.findIndex(tatum => range(tatum) > playTimeSeconds);

    const section = { index: sectionIndex, analysis: analysis.sections[sectionIndex]}
    const bar = { index: barIndex, analysis: analysis.bars[barIndex]}
    const beat = { index: beatIndex, analysis: analysis.beats[beatIndex]}
    const segment = { index: segmentIndex, analysis: analysis.segments[segmentIndex]}
    const tatum = { index: tatumIndex, analysis: analysis.tatums[tatumIndex]}

    setPlayTime(new Date(playTimeSeconds * 1000));
    setCurrentAnalysis({
      section,
      bar,
      beat,
      segment,
      tatum
    });
  }

  useRequestAnimationFrame({
    onAnimation: handleAnimation
  });

  if(!currentAnalysis?.beat?.analysis) return <>Track data is empty</>;

  const currentTime =
    (playTime?.getMinutes() ?? 0) * 60 +
    (playTime?.getSeconds() ?? 0) +
    (playTime?.getMilliseconds() ?? 0) / 1000;

  const start = currentAnalysis.beat.analysis.start;
  const duration = currentAnalysis.beat.analysis.duration;

  const persentage = 100 - (((currentTime - start)) / duration) * 100;

  return <>
    <p className='track-info'>
      <span className='track-name'>{track?.name}</span><br />
      <span className='track-artists'>{track?.artists.map(artist => artist.name).join(', ')}</span>
    </p>
    <p>
      <span className='label'>Play Time</span>
      {playTime?.getMinutes()}:{playTime?.getSeconds()}:{playTime?.getMilliseconds()}
    </p>
    <p>
      <span className='label'>Section {currentAnalysis.section.analysis?.start}</span>
      <span className='number'>{currentAnalysis.section.index}</span>
    </p>
    <p>
      <span className='label'>Bar {currentAnalysis.bar.analysis?.start}</span>
      <span className='number'>{currentAnalysis.bar.index}</span>
    </p>
    <p>
      <span className='label'>Beat {currentAnalysis.beat.analysis?.start}</span>
      <span className='number'>{currentAnalysis.beat.index}</span>
    </p>
    <div className='beat-indicator' style={
      { 'width': `${persentage}%` }}>
    </div>
    <p>
      <span className='label'>Segment</span>
      <span className='number'>{currentAnalysis.segment.index}</span>
    </p>
    <p>
      <span className='label'>Tatum</span>
      <span className='number'>{currentAnalysis.tatum.index}</span>
    </p>
  </>
}
