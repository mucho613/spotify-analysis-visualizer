import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { analysis } from './response';
import { useRequestAnimationFrame } from './useRequestAnimationFrame';

type CurrentPositionAnalysis = {
  section: number;
  bar: number;
  beat: number;
  segment: number;
  tatum: number;
}

function App() {
  const [startTime, setStartTime] = useState<number>(0);
  const [playTimeByResponse, setPlayTimeByResponse] = useState<number>(0);
  const [currentAnalysis, setCurrentAnalysis] = useState<CurrentPositionAnalysis>();
  const [playTime, setPlayTime] = useState<Date>();

  const handleAnimation = () => {
    const playTimeSeconds = (playTimeByResponse + (Date.now() - startTime)) / 1000;

    const section = analysis.sections.findIndex(section => section.start > playTimeSeconds);
    const bar = analysis.bars.findIndex(bar => bar.start > playTimeSeconds);
    const beat = analysis.beats.findIndex(beat => beat.start > playTimeSeconds);
    const segment = analysis.segments.findIndex(segment => segment.start > playTimeSeconds);
    const tatum = analysis.tatums.findIndex(segment => segment.start > playTimeSeconds);

    setPlayTime(new Date(playTimeSeconds * 1000));
    setCurrentAnalysis({
      section,
      bar,
      beat,
      segment,
      tatum
    });
  }

  useEffect(() => {
    setStartTime(Date.now() );

    fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer BQBjKgNMU_FndoEUfdEYpZzHEh_J3FoeFHd52S5tHZCy_AnI0AlGMPYhL4Go0G33tN3k_s30MTaxqVdiJqssHQWhOOERHRB5uWk5b32jVdmQF1Pw5d940Tv9RB6XvNXLlW3zjEWUrv7S6KpIvpDA8TcUUjAJybdzcj3VWLx7gmZdgWA'
      }
    }).then(async (response) => {
      const json = await response.json();
      if(json.progress_ms) {
        console.log(response);
        setPlayTimeByResponse(json.progress_ms);
      }
    })
  }, []);

  useRequestAnimationFrame({
    onAnimation: handleAnimation
  });

  return (
    <div className="App">
      <p>
        <span className='label'>Play Time</span>
        {playTime?.getMinutes()}:{playTime?.getSeconds()}:{playTime?.getMilliseconds()}
      </p>
      <p>
        <span className='label'>Section</span>
        {currentAnalysis?.section}
      </p>
      <p>
        <span className='label'>Bar</span>
        {currentAnalysis?.bar}
      </p>
      <p>
        <span className='label'>Beat</span>
        {currentAnalysis?.beat}
      </p>
      <p>
        <span className='label'>Segment</span>
        {currentAnalysis?.segment}
      </p>
      <p>
        <span className='label'>Tatum</span>
        {currentAnalysis?.tatum}
      </p>
    </div>
  );
}

export default App;
