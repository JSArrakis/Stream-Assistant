import { SelectedMedia } from '../../src/models/selectedMedia';
import { MediaType } from '../../src/models/enum/mediaTypes';
import * as streamCon from '../../src/services/streamConstructor';
import * as td from '../testData/testData';

describe('compareSelectedEndTime', () => {
  it('should not return an error if the end time is greater than the last scheduled media plus its duration', () => {
    const selected = [
      new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, [
        'scifi',
      ]),
      new SelectedMedia(
        td.interstellar,
        '',
        MediaType.Movie,
        1656633600,
        10800,
        ['scifi'],
      ),
    ];

    const error = streamCon.compareSelectedEndTime(1656644400, selected);

    expect(error).toBe('');
  });

  it('should return an error if the end time is less than the last scheduled media plus its duration', () => {
    const selected = [
      new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, [
        'scifi',
      ]),
      new SelectedMedia(
        td.interstellar,
        '',
        MediaType.Movie,
        1656633600,
        10800,
        ['scifi'],
      ),
    ];

    const error = streamCon.compareSelectedEndTime(1656633600, selected);

    expect(error).toBe(
      'Scheduled time for interstellar exceeds selected endTime',
    );
  });
});
