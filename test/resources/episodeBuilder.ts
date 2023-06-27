import { Episode } from "../../models/show";

export class EpisodeBuilder {
    private season: number;
    private episode: number;
    private episodeNumber: number;
    private path: string;
    private episodeTitle: string;
    private loadTitle: string;
    private duration: number;
    private durationLimit: number;
    private tags: string[];
  
    constructor() {
      this.season = 1;
      this.episode = 1;
      this.episodeNumber = 1;
      this.path = '';
      this.episodeTitle = '';
      this.loadTitle = '';
      this.duration = 0;
      this.durationLimit = 0;
      this.tags = [];
    }

    withSeason(season: number): EpisodeBuilder {
      this.season = season;
      return this;
    }

    withEpisode(episode: number): EpisodeBuilder {
      this.episode = episode;
      return this;
    }

    withEpisodeNumber(episodeNumber: number): EpisodeBuilder {
      this.episodeNumber = episodeNumber;
      return this;
    }

    withPath(path: string): EpisodeBuilder {
      this.path = path;
      return this;
    }

    withEpisodeTitle(loadTitle: string): EpisodeBuilder {
      this.loadTitle = loadTitle;
      return this;
    }

    withLoadTitle(loadTitle: string): EpisodeBuilder {
      this.loadTitle = loadTitle;
      return this;
    }

    withDuration(duration: number): EpisodeBuilder {
      this.duration = duration;
      return this;
    }
  
    withDurationLimit(durationLimit: number): EpisodeBuilder {
      this.durationLimit = durationLimit;
      return this;
    }

    withTags(tags: string[]): EpisodeBuilder {
      this.tags = tags;
      return this;
    }
  
    build(): Episode {
      return new Episode(
        this.season,
        this.episode,
        this.episodeNumber,
        this.path,
        this.episodeTitle,
        this.loadTitle,
        this.duration,
        this.durationLimit,
        this.tags,
      );
    }
  }