import * as proEng from '../../src/services/proceduralEngine';
import * as proMan from '../../src/services/progressionManager';
import { ContStreamRequest } from '../../src/models/streamRequest';
import { StreamType } from '../../src/models/enum/streamTypes';
import { Show } from '../../src/models/show';
import * as tdShows from '../testData/shows';
import * as tdProgression from '../testData/progression';

describe('getEpisodesUnderDuration', () => {
  beforeEach(() => {
    proMan.SetLocalProgressionContextList(
      JSON.parse(JSON.stringify([tdProgression.continuousProgression])),
    );
  });

  const args = new ContStreamRequest(
    'securePassword',
    tdProgression.continuousProgression.Title,
    tdProgression.continuousProgression.Environment,
    [],
    ['scifi', 'action'],
  );

  it('should return an array of episodes that are under the duration limit (result scenario 1)', () => {
    let shows: Show[] = [tdShows.reboot, tdShows.farscape, tdShows.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      1800,
      StreamType.Cont,
    );

    expect(episodes).toEqual([tdShows.reboot.Episodes[1]]);
    expect(showTitle).toEqual(tdShows.reboot.Title);
    randomSpy.mockRestore();
  });

  it('should return an array of episodes that are under the duration limit (result scenario 2)', () => {
    let shows: Show[] = [tdShows.reboot, tdShows.farscape, tdShows.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      3600,
      StreamType.Cont,
    );

    expect(episodes).toEqual([tdShows.reboot.Episodes[1], tdShows.reboot.Episodes[2]]);
    expect(showTitle).toEqual(tdShows.reboot.Title);
    randomSpy.mockRestore();
  });

  it('should return an array of episodes that are under the duration limit (result scenario 3)', () => {
    let shows: Show[] = [tdShows.batman, tdShows.farscape, tdShows.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      3600,
      StreamType.Cont,
    );

    expect(episodes).toEqual([tdShows.batman.Episodes[0], tdShows.batman.Episodes[1]]);
    expect(showTitle).toEqual(tdShows.batman.Title);
    randomSpy.mockRestore();
  });

  it('should return an array of episodes that are under the duration limit (result scenario 4)', () => {
    let shows: Show[] = [tdShows.batman, tdShows.farscape, tdShows.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);
    proMan.IncrementWatchRecord(
      tdProgression.continuousProgression.LoadTitle,
      tdProgression.batmanWatchRecord.LoadTitle,
      4,
      tdShows.batman,
    );

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      3600,
      StreamType.Cont,
    );

    expect(episodes).toEqual([tdShows.batman.Episodes[4], tdShows.batman.Episodes[0]]);
    expect(showTitle).toEqual(tdShows.batman.Title);
    randomSpy.mockRestore();
  });

  it('should return an array of episodes that are under the duration limit (result scenario 5)', () => {
    let shows: Show[] = [tdShows.reboot, tdShows.farscape, tdShows.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      3600,
      StreamType.Cont,
    );

    expect(episodes).toEqual([tdShows.farscape.Episodes[0]]);
    expect(showTitle).toEqual(tdShows.farscape.Title);
    randomSpy.mockRestore();
  });

  it('should return an array of episodes that are under the duration limit (result scenario 6)', () => {
    let shows: Show[] = [tdShows.reboot, tdShows.farscape, tdShows.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      7200,
      StreamType.Cont,
    );

    expect(episodes).toEqual([tdShows.startrek.Episodes[0]]);
    expect(showTitle).toEqual(tdShows.startrek.Title);
    randomSpy.mockRestore();
  });
});
