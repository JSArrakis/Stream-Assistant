import { Collection } from "../../models/collection";
import { Commercial } from "../../models/commercial";
import { Media } from "../../models/media";
import { Movie } from "../../models/movie";
import { Music } from "../../models/music";
import { Promo } from "../../models/promo";
import { Short } from "../../models/short";
import { Show } from "../../models/show";

export class MediaBuilder {
    private shows: Show[] = [];
    private movies: Movie[] = [];
    private shorts: Short[] = [];
    private music: Music[] = [];
    private promos: Promo[] = [];
    private commercials: Commercial[] = [];
    private collections: Collection[] = [];
  
    public withShow(show: Show): MediaBuilder {
      this.shows.push(show);
      return this;
    }
  
    public withMovie(movie: Movie): MediaBuilder {
      this.movies.push(movie);
      return this;
    }
  
    public withShort(short: Short): MediaBuilder {
      this.shorts.push(short);
      return this;
    }
  
    public withMusic(music: Music): MediaBuilder {
      this.music.push(music);
      return this;
    }
  
    public withPromo(promo: Promo): MediaBuilder {
      this.promos.push(promo);
      return this;
    }
  
    public withCommercial(commercial: Commercial): MediaBuilder {
      this.commercials.push(commercial);
      return this;
    }
  
    public withCollection(collection: Collection): MediaBuilder {
      this.collections.push(collection);
      return this;
    }
  
    public build(): Media {
      return new Media(this.shows, this.movies, this.shorts, this.music, this.promos, this.commercials, this.collections);
    }
  }