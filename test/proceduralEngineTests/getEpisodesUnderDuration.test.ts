import * as proEng from '../../src/services/proceduralEngine';
import * as proMan from '../../src/services/progressionManager';
import { ContStreamRequest } from '../../src/models/streamRequest';
import { StreamType } from '../../src/models/enum/streamTypes';
import { Show } from '../../src/models/show';
import * as td from '../testData/testData';

describe('getEpisodesUnderDuration', () => {
  beforeEach(() => {
    proMan.SetLocalProgressionContextList(
      JSON.parse(JSON.stringify([td.continuousProgression])),
    );
  });

  const args = new ContStreamRequest(
    'securePassword',
    td.continuousProgression.Title,
    td.continuousProgression.Environment,
    [],
    ['scifi', 'action'],
  );

  it('should return an array of episodes that are under the duration limit (result scenario 1)', () => {
    let shows: Show[] = [td.reboot, td.farscape, td.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      1800,
      StreamType.Cont,
    );

    expect(episodes).toEqual([td.reboot.Episodes[1]]);
    expect(showTitle).toEqual(td.reboot.Title);
    randomSpy.mockRestore();
  });

  it('should return an array of episodes that are under the duration limit (result scenario 2)', () => {
    let shows: Show[] = [td.reboot, td.farscape, td.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      3600,
      StreamType.Cont,
    );

    expect(episodes).toEqual([td.reboot.Episodes[1], td.reboot.Episodes[2]]);
    expect(showTitle).toEqual(td.reboot.Title);
    randomSpy.mockRestore();
  });

  it('should return an array of episodes that are under the duration limit (result scenario 3)', () => {
    let shows: Show[] = [td.batman, td.farscape, td.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      3600,
      StreamType.Cont,
    );

    expect(episodes).toEqual([td.batman.Episodes[0], td.batman.Episodes[1]]);
    expect(showTitle).toEqual(td.batman.Title);
    randomSpy.mockRestore();
  });

  it('should return an array of episodes that are under the duration limit (result scenario 4)', () => {
    let shows: Show[] = [td.batman, td.farscape, td.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);
    proMan.IncrementWatchRecord(
      td.continuousProgression.LoadTitle,
      td.batmanWatchRecord.LoadTitle,
      4,
      td.batman,
    );

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      3600,
      StreamType.Cont,
    );

    expect(episodes).toEqual([td.batman.Episodes[4], td.batman.Episodes[0]]);
    expect(showTitle).toEqual(td.batman.Title);
    randomSpy.mockRestore();
  });

  it('should return an array of episodes that are under the duration limit (result scenario 5)', () => {
    let shows: Show[] = [td.reboot, td.farscape, td.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      3600,
      StreamType.Cont,
    );

    expect(episodes).toEqual([td.farscape.Episodes[0]]);
    expect(showTitle).toEqual(td.farscape.Title);
    randomSpy.mockRestore();
  });

  it('should return an array of episodes that are under the duration limit (result scenario 6)', () => {
    let shows: Show[] = [td.reboot, td.farscape, td.startrek];
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [episodes, showTitle] = proEng.getEpisodesUnderDuration(
      args,
      shows,
      7200,
      StreamType.Cont,
    );

    expect(episodes).toEqual([td.startrek.Episodes[0]]);
    expect(showTitle).toEqual(td.startrek.Title);
    randomSpy.mockRestore();
  });
});
