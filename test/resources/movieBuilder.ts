import { Movie } from "../../src/models/movie";

export class MovieBuilder {
  private title: string = '';
  private loadTitle: string = '';
  private alias: string = '';
  private imdb: string = '';
  private tags: string[] = [];
  private path: string = '';
  private duration: number = 0;
  private durationLimit: number = 0;
  private collection: string = '';
  private collectionSequence: number = 0;

  setTitle(title: string): MovieBuilder {
    this.title = title;
    return this;
  }

  setLoadTitle(loadTitle: string): MovieBuilder {
    this.loadTitle = loadTitle;
    return this;
  }

  setAlias(alias: string): MovieBuilder {
    this.alias = alias;
    return this;
  }

  setImdb(imdb: string): MovieBuilder {
    this.imdb = imdb;
    return this;
  }

  setTags(tags: string[]): MovieBuilder {
    this.tags = tags;
    return this;
  }

  setPath(path: string): MovieBuilder {
    this.path = path;
    return this;
  }

  setDuration(duration: number): MovieBuilder {
    this.duration = duration;
    return this;
  }

  setDurationLimit(durationLimit: number): MovieBuilder {
    this.durationLimit = durationLimit;
    return this;
  }

  setCollection(collection: string): MovieBuilder {
    this.collection = collection;
    return this;
  }

  setCollectionSequence(collectionSequence: number): MovieBuilder {
    this.collectionSequence = collectionSequence;
    return this;
  }

  build(): Movie {
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