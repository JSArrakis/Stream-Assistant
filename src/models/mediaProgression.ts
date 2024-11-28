export class MediaProgression {
  Title: string;
  Type: string;
  Shows: ShowProgression[];

  constructor(title: string, type: string, shows: ShowProgression[]) {
    this.Title = title;
    this.Type = type;
    this.Shows = shows;
  }
}

export class ShowProgression {
  LoadTitle: string;
  Episode: number;

  constructor(loadTitle: string, episode: number) {
    this.LoadTitle = loadTitle;
    this.Episode = episode;
  }
}
