import { Episode, Show } from "../../models/show";

export class ShowBuilder {
    private title: string;
    private loadTitle: string;
    private alias: string;
    private imdb: string;
    private durationLimit: number;
    private overDuration: boolean;
    private tags: string[];
    private episodeCount: number;
    private episodes: Episode[];
  
    constructor() {
      this.title = '';
      this.loadTitle = '';
      this.alias = '';
      this.imdb = '';
      this.durationLimit = 0;
      this.overDuration = false;
      this.tags = [];
      this.episodeCount = 0;
      this.episodes = [];
    }
  
    public withTitle(title: string): ShowBuilder {
      this.title = title;
      return this;
    }

    public withLoadTitle(loadTitle: string): ShowBuilder {
      this.loadTitle = loadTitle;
      return this;
    }

    public withAlias(alias: string): ShowBuilder {
      this.alias = alias;
      return this;
    }

    public withIMDB(imdb: string): ShowBuilder {
        this.imdb = imdb;
        return this;
    }
  
    public withDurationLimit(durationLimit: number): ShowBuilder {
      this.durationLimit = durationLimit;
      return this;
    }

    public withOverDuration(overDuration: boolean): ShowBuilder {
        this.overDuration = overDuration;
        return this;
    }
  
    public withTags(tags: string[]): ShowBuilder {
      this.tags = tags;
      return this;
    }
    
    public withEpisodeCount(episodeCount: number): ShowBuilder {
        this.episodeCount = episodeCount;
        return this;
    }

    public withEpisode(episode: Episode): ShowBuilder {
      this.episodes.push(episode);
      return this;
    }
  
    public withEpisodeList(episodes: Episode[]): ShowBuilder {
      this.episodes.push(...episodes);
      return this;
    }
  
    public build(): Show {
      return new Show(
        this.title,
        this.loadTitle,
        this.alias,
        this.imdb,
        this.durationLimit,
        this.overDuration,
        this.tags,
        this.episodeCount,
        this.episodes
      );
    }
  }
  