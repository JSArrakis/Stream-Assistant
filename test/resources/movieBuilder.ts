import { Movie } from "../../models/movie";

export class MovieBuilder {
    private title: string;
    private loadTitle: string;
    private alias: string;
    private imdb: string;
    private tags: string[];
    private path: string;
    private duration: number;
    private durationLimit: number;
    private collection: string;
    private collectionSequence: number;
  
    constructor() {
      this.title = '';
      this.loadTitle = '';
      this.alias = '';
      this.imdb = '';
      this.tags = [];
      this.path = '';
      this.duration = 0;
      this.durationLimit = 0;
      this.collection = '';
      this.collectionSequence = 0;
    }
  
    public withTitle(title: string): MovieBuilder {
      this.title = title;
      return this;
    }

    public withLoadTitle(loadTitle: string): MovieBuilder {
      this.loadTitle = loadTitle;
      return this;
    }

    public withAlias(alias: string): MovieBuilder {
      this.alias = alias;
      return this;
    }

    public withIMDB(imdb: string): MovieBuilder {
      this.imdb = imdb;
      return this;
    }

    public withTags(tags: string[]): MovieBuilder {
      this.tags = tags;
      return this;
    }

    public withPath(path: string): MovieBuilder {
      this.path = path;
      return this;
    }
  
    public withDuration(duration: number): MovieBuilder {
      this.duration = duration;
      return this;
    }
  
    public withDurationLimit(durationLimit: number): MovieBuilder {
      this.durationLimit = durationLimit;
      return this;
    }

    public withCollection(collection: string): MovieBuilder {
      this.collection = collection;
      return this;
    }

    public withCollectionSequence(collectionSequence: number): MovieBuilder {
      this.collectionSequence = collectionSequence;
      return this;
    }
  
    public build(): Movie {
      return new Movie(
        this.title,
        this.loadTitle,
        this.alias,
        this.imdb,
        this.tags,
        this.path,
        this.duration,
        this.durationLimit,
        this.collection,
        this.collectionSequence
      );
    }
  }
  