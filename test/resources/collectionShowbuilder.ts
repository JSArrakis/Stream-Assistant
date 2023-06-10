import { Bumper } from "../../models/bumper";
import { CollectionShow } from "../../models/collection";
import { Episode } from "../../models/show";

export class CollectionShowBuilder {
    private loadTitle: string;
    private sequence: number;
    private subsequence: number;
    private durationLimit: number;
    private bumperStart?: Bumper;
    private bumperEnd?: Bumper;
    private episode?: Episode;
  
    constructor() {
      this.loadTitle = '';
      this.sequence = 0;
      this.subsequence = 0;
      this.durationLimit = 0;
    }
  
    public withLoadTitle(loadTitle: string): CollectionShowBuilder {
      this.loadTitle = loadTitle;
      return this;
    }
  
    public withSequence(sequence: number): CollectionShowBuilder {
      this.sequence = sequence;
      return this;
    }
  
    public withSubsequence(subsequence: number): CollectionShowBuilder {
      this.subsequence = subsequence;
      return this;
    }
  
    public withDurationLimit(durationLimit: number): CollectionShowBuilder {
      this.durationLimit = durationLimit;
      return this;
    }
  
    public withBumperStart(bumper?: Bumper): CollectionShowBuilder {
      this.bumperStart = bumper;
      return this;
    }
  
    public withBumperEnd(bumper?: Bumper): CollectionShowBuilder {
      this.bumperEnd = bumper;
      return this;
    }
  
    public withEpisode(episode?: Episode): CollectionShowBuilder {
      this.episode = episode;
      return this;
    }
  
    public build(): CollectionShow {
      return new CollectionShow(
        this.loadTitle,
        this.sequence,
        this.subsequence,
        this.durationLimit,
        this.bumperStart,
        this.bumperEnd,
        this.episode
      );
    }
  }