declare namespace SpotifyApi {
  interface Dur {
    start: number;
    duration: number;
    confidence: number;
  }

  interface AudioAnalysisJSON {
    sections: Dur[];
    bars: Dur[];
    beats: Dur[];
    segments: Dur[];
    tatums: Dur[];
  }
}
