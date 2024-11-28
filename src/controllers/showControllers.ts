import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ShowModel, Show } from '../models/show';
import { getMediaDuration } from '../utils/utilities';

// ===========================================
//               SHOW HANDLERS
// ===========================================

export async function createShowHandler(
  req: Request,
  res: Response,
): Promise<void> {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  let loadTitle = req.body.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  // Retrieve show from MongoDB using show load title if it exists
  const show = await ShowModel.findOne({ LoadTitle: loadTitle });

  // If it exists, return error
  if (show) {
    res.status(400).json({ message: 'Show already exists' });
    return;
  }
  // If it doesn't exist, perform transformations
  let createdShow = await transformShowFromRequest(req.body, loadTitle);

  // Insert show into MongoDB
  await ShowModel.create(createdShow);

  res.status(200).json({ message: 'Show Created' });
  return;
}

// Delete Show by Load Title
export async function deleteShowHandler(
  req: Request,
  res: Response,
): Promise<void> {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // Retrieve show from MongoDB using show load title if it exists
  const show = await ShowModel.findOne({ LoadTitle: req.query.loadTitle });

  // If it doesn't exist, return error
  if (!show) {
    res.status(400).json({ message: 'Show does not exist' });
    return;
  }

  // If it exists, delete it
  await ShowModel.deleteOne({ _id: show._id });

  res.status(200).json({ message: 'Show Deleted' });
  return;
}

export async function updateShowHandler(
  req: Request,
  res: Response,
): Promise<void> {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  let loadTitle = req.body.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  // Retrieve show from MongoDB using show load title if it exists
  const show = await ShowModel.findOne({ LoadTitle: loadTitle });

  // If it doesn't exist, return error
  if (!show) {
    res.status(400).json({ message: 'Show does not exist' });
    return;
  }

  // If it exists, perform transformations
  let updatedShow = await transformShowFromRequest(req.body, loadTitle);

  // Update show in MongoDB
  await ShowModel.updateOne({ _id: show._id }, updatedShow);

  res.status(200).json({ message: 'Show Updated' });
  return;
}

export async function getShowHandler(
  req: Request,
  res: Response,
): Promise<void> {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // Retrieve show from MongoDB using show load title if it exists using request params
  const show = await ShowModel.findOne({ LoadTitle: req.query.loadTitle });

  // If it doesn't exist, return error
  if (!show) {
    res.status(404).json({ message: 'Show does not exist' });
    return;
  }

  res.status(200).json(show);
  return;
}

export async function getAllShowsDataHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const shows = await ShowModel.find();

  if (!shows || shows.length === 0) {
    res.status(404).json({ message: 'No Shows Found' });
    return;
  }
  let showsData = shows.map((show: any) => {
    return {
      title: show.Title,
      loadTitle: show.LoadTitle,
      alias: show.Alias,
      imdb: show.IMDB,
      durationLimit: show.DurationLimit,
      overDuration: show.OverDuration,
      firstEpisodeOverDuration: show.FirstEpisodeOverDuration,
      tags: show.Tags,
      secondaryTags: show.SecondaryTags,
      episodeCount: show.EpisodeCount,
    };
  });

  res.status(200).json(showsData);
  return;
}

export async function transformShowFromRequest(
  show: any,
  loadTitle: string,
): Promise<Show> {
  let parsedShow: Show = Show.fromRequestObject(show);

  parsedShow.LoadTitle = loadTitle;

  parsedShow.Alias = parsedShow.LoadTitle;

  for (const episode of parsedShow.Episodes) {
    if (episode.Duration > 0) continue; // Skip if duration is already set
    console.log(`Getting duration for ${episode.Path}`);
    let durationInSeconds = await getMediaDuration(episode.Path);
    episode.Duration = durationInSeconds; // Update duration value
    episode.DurationLimit =
      Math.floor(episode.Duration / 1800) * 1800 +
      (episode.Duration % 1800 > 0 ? 1800 : 0);
    // set episode load title using show load title and episode number
  }

  //create an accounting of how many different duration limits there are and create a map of it
  let durationLimitsMap = new Map();
  parsedShow.Episodes.forEach(episode => {
    if (durationLimitsMap.has(episode.DurationLimit)) {
      durationLimitsMap.set(
        episode.DurationLimit,
        durationLimitsMap.get(episode.DurationLimit) + 1,
      );
    } else {
      durationLimitsMap.set(episode.DurationLimit, 1);
    }
  });

  //use the map to determine which duration limit is the most common and use that as the show duration limit
  let maxCount = 0;
  let maxDurationLimit = 0;
  durationLimitsMap.forEach((value, key) => {
    if (value > maxCount) {
      maxCount = value;
      maxDurationLimit = key;
    }
  });
  parsedShow.DurationLimit = maxDurationLimit;

  //if there are episodes with durations over the duration limit, set the show to over duration
  parsedShow.OverDuration = parsedShow.Episodes.some(
    episode => episode.Duration > parsedShow.DurationLimit,
  );

  //assume the episodes of the show are in order and set the episode number to the index of the episode in the array + 1
  parsedShow.Episodes.forEach((episode, index) => {
    episode.EpisodeNumber = index + 1;
    episode.LoadTitle = `${parsedShow.LoadTitle}-${episode.EpisodeNumber}`;
  });

  //set the episode count to the length of the episodes array
  parsedShow.EpisodeCount = parsedShow.Episodes.length;

  return parsedShow;
}
