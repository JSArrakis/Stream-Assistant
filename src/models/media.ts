import { Show } from "./show";
import { Movie } from "./movie";
import { Short } from "./short";
import { Music } from "./music";
import { Promo } from "./promo";
import { Commercial } from "./commercial";
import { Collection } from "./collection";

export class Media {
    Shows: Show[];
    Movies: Movie[];
    Shorts: Short[];
    Music: Music[];
    Promos: Promo[];
    Commercials: Commercial[];
    Collections: Collection[];

    constructor(shows: Show[],
        movies: Movie[],
        shorts: Short[],
        music: Music[],
        promos: Promo[],
        commercials: Commercial[],
        collections: Collection[]
    ) {

        this.Shows = shows;
        this.Movies = movies;
        this.Shorts = shorts;
        this.Music = music;
        this.Promos = promos;
        this.Commercials = commercials;
        this.Collections = collections;
    }
}

