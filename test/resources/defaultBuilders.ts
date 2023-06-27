import { Media } from "../../models/media";
import { Movie } from "../../models/movie";
import { Episode, Show } from "../../models/show";
import { CollectionBuilder } from "./collectionBuilder";
import { CollectionShowBuilder } from "./collectionShowbuilder";
import { EpisodeBuilder } from "./episodeBuilder";
import { MediaBuilder } from "./mediaBuilder";
import { MovieBuilder } from "./movieBuilder";
import { ShowBuilder } from "./showbuilder";

export function createDefaultMedia(): Media {
      const media = new MediaBuilder()
        .withShowList(createDefaultShowList())
        .withMovieList(createDefaultMovieList())
        .build();
  
    return media;
}

export function createDefaultMovieList(): Movie[] {
    const movies: Movie[] = [
        new MovieBuilder()
          .withTitle('Test1')
          .withLoadTitle('test1')
          .withAlias('test1')
          .withIMDB('')
          .withTags(["tag1", "tag2", "tag3"])
          .withPath('')
          .withDuration(6451)
          .withDurationLimit(7200)
          .withCollection('')
          .withCollectionSequence(0)
          .build(),
        new MovieBuilder()
          .withTitle('Test2')
          .withLoadTitle('test2')
          .withAlias('test2')
          .withIMDB('')
          .withTags(["tag1", "tag2"])
          .withPath('')
          .withDuration(6351)
          .withDurationLimit(7200)
          .withCollection('')
          .withCollectionSequence(0)
          .build(),
        new MovieBuilder()
          .withTitle('Test3')
          .withLoadTitle('test3')
          .withAlias('test3')
          .withIMDB('')
          .withTags(["tag2", "tag3"])
          .withPath('')
          .withDuration(7000)
          .withDurationLimit(7200)
          .withCollection('')
          .withCollectionSequence(0)
          .build(),
        new MovieBuilder()
          .withTitle('Test4')
          .withLoadTitle('test4')
          .withAlias('test4')
          .withIMDB('')
          .withTags(["tag2", "tag4"])
          .withPath('')
          .withDuration(7000)
          .withDurationLimit(7200)
          .withCollection('')
          .withCollectionSequence(0)
          .build(),
    ]

    return movies;
}

export function createDefaultShowList(): Show[] {
    const shows: Show[]= [
        new ShowBuilder()
          .withTitle('Show1')
          .withLoadTitle('show1')
          .withAlias('alias')
          .withIMDB('imdb')
          .withDurationLimit(1800)
          .withOverDuration(false)
          .withTags([])
          .withEpisodeCount(5)
          .withEpisodeList(createDefaultEpisodeList())
          .build(),
        new ShowBuilder()
          .withTitle('Show2')
          .withLoadTitle('show2')
          .withAlias('alias')
          .withIMDB('imdb')
          .withDurationLimit(1800)
          .withOverDuration(false)
          .withTags([])
          .withEpisodeCount(5)
          .withEpisodeList(createDefaultEpisodeList())
          .build(),
        new ShowBuilder()
          .withTitle('Show3')
          .withLoadTitle('show3')
          .withAlias('alias')
          .withIMDB('imdb')
          .withDurationLimit(1800)
          .withOverDuration(false)
          .withTags([])
          .withEpisodeCount(5)
          .withEpisodeList(createDefaultEpisodeList())
          .build(),
        new ShowBuilder()
          .withTitle('Show4')
          .withLoadTitle('show4')
          .withAlias('alias')
          .withIMDB('imdb')
          .withDurationLimit(1800)
          .withOverDuration(false)
          .withTags([])
          .withEpisodeCount(5)
          .withEpisodeList(createDefaultEpisodeList())
          .build(),
        new ShowBuilder()
          .withTitle('Show5')
          .withLoadTitle('show5')
          .withAlias('alias')
          .withIMDB('imdb')
          .withDurationLimit(1800)
          .withOverDuration(false)
          .withTags([])
          .withEpisodeCount(5)
          .withEpisodeList(createAlternateEpisodeList())
          .build()
    ]

  return shows;
}

export function createDefaultEpisodeList(): Episode[] {
    const epiodes: Episode[]= [
        new EpisodeBuilder()
          .withSeason(1)
          .withEpisode(1)
          .withEpisodeNumber(1)
          .withPath('')
          .withEpisodeTitle('episode1')
          .withLoadTitle('episode1')
          .withDuration(1648)
          .withDurationLimit(1800)
          .withTags([])
          .build(),
        new EpisodeBuilder()
          .withSeason(1)
          .withEpisode(1)
          .withEpisodeNumber(1)
          .withPath('')
          .withEpisodeTitle('episode2')
          .withLoadTitle('episode2')
          .withDuration(1709)
          .withDurationLimit(1800)
          .withTags([])
          .build(),
        new EpisodeBuilder()
          .withSeason(1)
          .withEpisode(1)
          .withEpisodeNumber(1)
          .withPath('')
          .withEpisodeTitle('episode3')
          .withLoadTitle('episode3')
          .withDuration(1603)
          .withDurationLimit(1800)
          .withTags([])
          .build(),
        new EpisodeBuilder()
          .withSeason(1)
          .withEpisode(1)
          .withEpisodeNumber(1)
          .withPath('')
          .withEpisodeTitle('episode4')
          .withLoadTitle('episode4')
          .withDuration(1600)
          .withDurationLimit(1800)
          .withTags([])
          .build(),
        new EpisodeBuilder()
          .withSeason(1)
          .withEpisode(1)
          .withEpisodeNumber(1)
          .withPath('')
          .withEpisodeTitle('episode5')
          .withLoadTitle('episode5')
          .withDuration(1699)
          .withDurationLimit(1800)
          .withTags([])
          .build(),
    ]

  return epiodes;
}

export function createAlternateEpisodeList(): Episode[] {
    const epiodes: Episode[]= [
        new EpisodeBuilder()
          .withSeason(1)
          .withEpisode(1)
          .withEpisodeNumber(1)
          .withPath('')
          .withEpisodeTitle('episode1')
          .withLoadTitle('episode1')
          .withDuration(1648)
          .withDurationLimit(1800)
          .withTags([])
          .build(),
        new EpisodeBuilder()
          .withSeason(1)
          .withEpisode(1)
          .withEpisodeNumber(1)
          .withPath('')
          .withEpisodeTitle('episode2')
          .withLoadTitle('episode2')
          .withDuration(1709)
          .withDurationLimit(1800)
          .withTags([])
          .build(),
        new EpisodeBuilder()
          .withSeason(1)
          .withEpisode(1)
          .withEpisodeNumber(1)
          .withPath('')
          .withEpisodeTitle('episode3')
          .withLoadTitle('episode3')
          .withDuration(1603)
          .withDurationLimit(1800)
          .withTags([])
          .build(),
        new EpisodeBuilder()
          .withSeason(1)
          .withEpisode(1)
          .withEpisodeNumber(1)
          .withPath('')
          .withEpisodeTitle('episode4')
          .withLoadTitle('episode4')
          .withDuration(1600)
          .withDurationLimit(1800)
          .withTags([])
          .build(),
        new EpisodeBuilder()
          .withSeason(1)
          .withEpisode(1)
          .withEpisodeNumber(1)
          .withPath('')
          .withEpisodeTitle('episode5')
          .withLoadTitle('episode5')
          .withDuration(2703)
          .withDurationLimit(1800)
          .withTags([])
          .build(),
    ]
  return epiodes;
}