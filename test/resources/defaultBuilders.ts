import { Media } from "../../models/media";
import { CollectionBuilder } from "./collectionBuilder";
import { CollectionShowBuilder } from "./collectionShowbuilder";
import { MediaBuilder } from "./mediaBuilder";
import { MovieBuilder } from "./movieBuilder";
import { ShowBuilder } from "./showbuilder";

export function createDefaultMedia(): Media {
      const media = new MediaBuilder()
        .withShow(new ShowBuilder()
            .withTitle('Default Show')
            .withOverDuration(false)
            .withDurationLimit(1800)
            .build())
        .withMovie(new MovieBuilder()
            .withTitle('Default Movie')
            .withDuration(90)
            .withDurationLimit(3600)
            .build())
        .withCollection(new CollectionBuilder()
            .withTitle('Default Collection')
            .withLoadTitle('Default Load Title')
            .withType('Default Type')
            .withDuration(1800)
            .withDurationLimit(3600)
            .withShows([
                new CollectionShowBuilder()
                .withLoadTitle('Default Load Title')
                .withSequence(1)
                .withSubsequence(1)
                .withDurationLimit(1800)
                .build()
            ])
            .build())
        .build();
  
    return media;
  }