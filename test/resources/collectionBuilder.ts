import { Bumper } from "../../models/bumper";
import { CollectionShow, Collection } from "../../models/collection";
import { Promo } from "../../models/promo";

export class CollectionBuilder {
  private title: string;
  private loadTitle: string;
  private type: string;
  private duration: number;
  private durationLimit: number;
  private tags: string[];
  private startBumper: Bumper;
  private endBumper: Bumper;
  private promos: Promo[];
  private shows: CollectionShow[];
  private path: string;

  constructor() {
    this.title = '';
    this.loadTitle = '';
    this.type = '';
    this.duration = 0;
    this.durationLimit = 0;
    this.tags = [];
    this.promos = [];
    this.shows = [];
    this.path = '';
  }

  public withTitle(title: string): CollectionBuilder {
    this.title = title;
    return this;
  }

  public withLoadTitle(loadTitle: string): CollectionBuilder {
    this.loadTitle = loadTitle;
    return this;
  }

  public withType(type: string): CollectionBuilder {
    this.type = type;
    return this;
  }

  public withDuration(duration: number): CollectionBuilder {
    this.duration = duration;
    return this;
  }

  public withDurationLimit(durationLimit: number): CollectionBuilder {
    this.durationLimit = durationLimit;
    return this;
  }

  public withTags(tags: string[]): CollectionBuilder {
    this.tags = tags;
    return this;
  }

  public withStartBumper(bumper: Bumper): CollectionBuilder {
    this.startBumper = bumper;
    return this;
  }

  public withEndBumper(bumper: Bumper): CollectionBuilder {
    this.endBumper = bumper;
    return this;
  }

  public withPromos(promos: Promo[]): CollectionBuilder {
    this.promos = promos;
    return this;
  }

  public withShows(shows: CollectionShow[]): CollectionBuilder {
    this.shows = shows;
    return this;
  }

  public withPath(path: string): CollectionBuilder {
    this.path = path;
    return this;
  }

  public build(): Collection {
    return new Collection(
      this.title,
      this.loadTitle,
      this.type,
      this.duration,
      this.durationLimit,
      this.tags,
      this.startBumper,
      this.endBumper,
      this.promos,
      this.shows,
      this.path
    );
  }
}
