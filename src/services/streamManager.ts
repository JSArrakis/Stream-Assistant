import { MediaBlock } from '../models/mediaBlock';
import { constructStream } from './streamConstructor';
import { Config } from '../models/config';
import { StreamArgs } from '../models/streamArgs';
import { Media } from '../models/media';
import { Request } from 'express';
import { addMediaBlock } from './backgroundService';
import { IStreamRequest } from '../models/streamRequest';
import { StreamType } from '../models/enum/streamTypes';
import { Mosaic } from '../models/mosaic';

let upcomingStream: MediaBlock[] = [];
let onDeckStream: MediaBlock[] = [];
let continuousStream = false;
let args: IStreamRequest;
let streamVarianceInSeconds = 0;

function initializeStream(
  config: Config,
  streamArgs: IStreamRequest,
  media: Media,
  mosaics: Mosaic[],
  streamType: StreamType,
): string {
  // Constructs the stream based on the config, continuous stream args, and available media
  // The stream is assigned to upcoming stream which the background service will use to populate the on deck stream
  // The stream is constructed to fill the time until 12:00am
  // The background service will run construct stream again 30 minutes before the end of the day to fill the time until 12:00am the next day
  let upcomingStreamResponse: [MediaBlock[], string] = constructStream(
    config,
    streamArgs,
    media,
    mosaics,
    streamType,
  );
  if (upcomingStreamResponse[1] !== '') {
    return upcomingStreamResponse[1];
  }
  upcomingStream = upcomingStreamResponse[0];
  return '';
}

function initializeOnDeckStream(): void {
  for (let i = 0; i < 2; i++) {
    if (upcomingStream.length > 0) {
      let selectedObject = upcomingStream.shift();
      if (selectedObject != null || selectedObject != undefined) {
        onDeckStream.push(selectedObject);
      }
    }
  }
}

function addToOnDeckStream(mediaBlocks: MediaBlock[]): void {
  onDeckStream.push(...mediaBlocks);
}

function removeFromOnDeckStream(): MediaBlock | undefined {
  return onDeckStream.shift();
}

function removeFromUpcomingStream(): MediaBlock | undefined {
  return upcomingStream.shift();
}

function getUpcomingStream(): MediaBlock[] {
  return upcomingStream;
}

function getOnDeckStream(): MediaBlock[] {
  return onDeckStream;
}

function getOnDeckStreamLength(): number {
  return onDeckStream.length;
}

function isContinuousStream(): boolean {
  return continuousStream;
}

function setContinuousStream(value: boolean): void {
  continuousStream = value;
}

function getContinuousStreamArgs(): IStreamRequest {
  return args;
}

function setContinuousStreamArgs(value: IStreamRequest): void {
  args = value;
}

function convertISOToUnix(isoDateTime: string): number {
  // Convert ISO 8601 date-time to Unix timestamp in seconds
  return Math.floor(new Date(isoDateTime).getTime() / 1000);
}

function getStreamVariationInSeconds(): number {
  return streamVarianceInSeconds;
}

function setStreamVariationInSeconds(value: number): void {
  streamVarianceInSeconds = value;
}

export function mapStreamStartRequestToInputArgs(req: Request): StreamArgs {
  const { env, movies, tagsOR, endTime, startTime } = req.body;
  const inputArgs: StreamArgs = new StreamArgs(req.body.password);
  // The environment is a instance of a stream themed with promos and other content specific to that stream
  // TODO - check if the environment currently controls the progression of the shows on the stream (because it should)
  // TODO - Add specific configurations of the stream based on environment (I.E. Blacklisted Commercials, Special Promos, etc.)
  // The reason to have multiple environments is to allow for different streams to be run on the same server
  if (env) {
    inputArgs.env = env;
  }

  // TagsOR is an array of tags that are used to filter the media items that are available for the stream
  // The OR is not a XOR. If a media item has any of the tags in the array, it will be included in the stream
  if (tagsOR) {
    inputArgs.tagsOR = tagsOR;
  }

  // TODO - TagsAND is an array of tags that are used to filter the media items that are available for the stream
  // If a media item has all of the tags in a grouping (probably grouped by object) in the array, it will be included in the stream

  // Convert and map endTime and startTime to Unix timestamps
  // The reason we use Unix timestamps is because they are easier to work with when calculating the time until the next media block by using seconds
  if (endTime) {
    inputArgs.endTime = convertISOToUnix(endTime);
  }
  if (startTime) {
    inputArgs.startTime = convertISOToUnix(startTime);
  }

  // Map movies with date conversion
  // The movies array is a list of movie items that are to be included in the stream
  // This is an adhoc way to add movies to the stream that you want to see in the line up
  // Currently the movies input here will show up every day for the stream as the Stream Args are reused for each day the continuous stream is running
  // The format for the movies array is "Movie Title::YYYY-MM-DDTHH:MM:SSZ" or "Movie Title"
  // If the date is included, the movie will only show up on that day and time
  // TODO - A decision needs to be made if we will allow this for the continuous stream or if we will only allow it for adhoc streams
  // Either way, we will need to make sure "injected" unscheduled movies do not repeat in the stream on a daily basis
  if (movies && Array.isArray(movies)) {
    inputArgs.movies = movies.map(movie => {
      const [firstPart, secondPart] = movie.split('::');
      if (secondPart) {
        // If "::" delimiter exists, convert the second part (ISO date) to Unix timestamp
        const unixTimestamp = convertISOToUnix(secondPart);
        // Rejoin the parts with "::" and the Unix timestamp
        return `${firstPart}::${unixTimestamp}`;
      } else {
        // No "::" delimiter, pass through the original string
        return movie;
      }
    });
  }

  return inputArgs;
}

async function addInitialMediaBlocks() {
  for (const item of onDeckStream) {
    await addMediaBlock(item);
  }
}

export {
  initializeStream,
  initializeOnDeckStream,
  addToOnDeckStream,
  removeFromOnDeckStream,
  getUpcomingStream,
  getOnDeckStream,
  getOnDeckStreamLength,
  isContinuousStream,
  setContinuousStream,
  getContinuousStreamArgs,
  setContinuousStreamArgs,
  addInitialMediaBlocks,
  removeFromUpcomingStream,
  setStreamVariationInSeconds,
  getStreamVariationInSeconds,
};
