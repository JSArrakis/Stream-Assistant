import { MediaType } from '../../src/models/enum/mediaTypes';
import { SelectedMedia } from '../../src/models/selectedMedia';
import * as streamCon from '../../src/services/streamConstructor';
import { Media } from '../../src/models/media';
import { ContStreamRequest } from '../../src/models/streamRequest';
import { StagedMedia } from '../../src/models/stagedMedia';
import * as proMan from '../../src/services/progressionManager';
import { Config } from '../../src/models/config';
import { StreamType } from '../../src/models/enum/streamTypes';
import * as tdProgression from '../testData/progression';
import * as tdMovies from '../testData/movies';
import * as tdShows from '../testData/shows';

describe('getStagedStream', () => {
  beforeEach(() => {
    proMan.SetLocalProgressionContextList(
      JSON.parse(JSON.stringify([tdProgression.continuousProgression])),
    );
  });

  const rightNow = 1651750471;
  const config = new Config('', 1800, '', '');
  const args = new ContStreamRequest(
    'securePassword',
    tdProgression.continuousProgression.Title,
    tdProgression.continuousProgression.Environment,
    [],
    ['scifi', 'action'],
  );

  it('should return a list of selected media and an empty error message (scenario 1)', () => {
    let stagedMedia = new StagedMedia(
      [],
      [
        new SelectedMedia(tdMovies.matrix, '', MediaType.Movie, 0, 9000, [
          'action',
        ]),
      ],
      1651753800,
    );

    let media = new Media(
      [tdShows.reboot, tdShows.farscape, tdShows.startrek],
      [
        tdMovies.inception,
        tdMovies.matrix,
        tdMovies.interstellar,
        tdMovies.dune,
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [selectedMedia, error] = streamCon.getStagedStream(
      rightNow,
      config,
      args,
      stagedMedia,
      media,
      StreamType.Cont,
    );
    let expected = [
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        1651752000,
        1800,
        ['scifi', 'adventure'],
      ),
    ];

    expect(selectedMedia).toEqual(expected);
    expect(error).toBe('');

    randomSpy.mockRestore();
  });

  it('should return a list of selected media and an empty error message (scenario 2)', () => {
    let stagedMedia = new StagedMedia(
      [],
      [
        new SelectedMedia(tdMovies.matrix, '', MediaType.Movie, 0, 9000, [
          'action',
        ]),
      ],
      1651761000,
    );
    let media = new Media(
      [tdShows.reboot, tdShows.farscape, tdShows.startrek],
      [
        tdMovies.inception,
        tdMovies.matrix,
        tdMovies.interstellar,
        tdMovies.dune,
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [selectedMedia, error] = streamCon.getStagedStream(
      rightNow,
      config,
      args,
      stagedMedia,
      media,
      StreamType.Cont,
    );
    let expected = [
      new SelectedMedia(tdMovies.matrix, '', MediaType.Movie, 1651752000, 9000, [
        'action',
      ]),
    ];

    expect(selectedMedia).toEqual(expected);
    expect(error).toBe('');

    randomSpy.mockRestore();
  });

  it('should return a list of selected media and an empty error message (scenario 3)', () => {
    let stagedMedia = new StagedMedia(
      [],
      [
        new SelectedMedia(tdMovies.matrix, '', MediaType.Movie, 0, 9000, [
          'action',
        ]),
      ],
      1651762800,
    );
    let media = new Media(
      [tdShows.reboot, tdShows.farscape, tdShows.startrek],
      [
        tdMovies.inception,
        tdMovies.matrix,
        tdMovies.interstellar,
        tdMovies.dune,
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [selectedMedia, error] = streamCon.getStagedStream(
      rightNow,
      config,
      args,
      stagedMedia,
      media,
      StreamType.Cont,
    );
    let expected = [
      new SelectedMedia(
        tdMovies.matrix,
        '',
        MediaType.Movie,
        1651752000,
        9000,
        ['action'],
      ),
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        1651761000,
        1800,
        ['scifi', 'adventure'],
      ),
    ];

    expect(selectedMedia).toEqual(expected);
    expect(error).toBe('');

    randomSpy.mockRestore();
  });

  it('should return a list of selected media and an empty error message (scenario 4)', () => {
    let stagedMedia = new StagedMedia(
      [
        new SelectedMedia(
          tdMovies.matrix,
          '',
          MediaType.Movie,
          1651753800,
          9000,
          ['action'],
        ),
      ],
      [],
      1651762800,
    );
    let media = new Media(
      [tdShows.reboot, tdShows.farscape, tdShows.startrek],
      [
        tdMovies.inception,
        tdMovies.matrix,
        tdMovies.interstellar,
        tdMovies.dune,
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [selectedMedia, error] = streamCon.getStagedStream(
      rightNow,
      config,
      args,
      stagedMedia,
      media,
      StreamType.Cont,
    );
    let expected = [
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        1651752000,
        1800,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdMovies.matrix,
        '',
        MediaType.Movie,
        1651753800,
        9000,
        ['action'],
      ),
    ];

    expect(selectedMedia).toEqual(expected);
    expect(error).toBe('');

    randomSpy.mockRestore();
  });

  it('should return a list of selected media and an empty error message (scenario 5)', () => {
    let stagedMedia = new StagedMedia(
      [
        new SelectedMedia(
          tdMovies.matrix,
          '',
          MediaType.Movie,
          1651753800,
          9000,
          ['action'],
        ),
      ],
      [
        new SelectedMedia(tdMovies.inception, '', MediaType.Movie, 0, 9000, [
          'scifi',
        ]),
      ],
      1651764600,
    );
    let media = new Media(
      [tdShows.reboot, tdShows.farscape, tdShows.startrek],
      [
        tdMovies.inception,
        tdMovies.matrix,
        tdMovies.interstellar,
        tdMovies.dune,
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [selectedMedia, error] = streamCon.getStagedStream(
      rightNow,
      config,
      args,
      stagedMedia,
      media,
      StreamType.Cont,
    );
    let expected = [
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        1651752000,
        1800,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdMovies.matrix,
        '',
        MediaType.Movie,
        1651753800,
        9000,
        ['action'],
      ),
      new SelectedMedia(
        tdShows.reboot.Episodes[2],
        tdShows.reboot.Title,
        MediaType.Episode,
        1651762800,
        1800,
        ['scifi', 'adventure'],
      ),
    ];

    expect(selectedMedia).toEqual(expected);
    expect(error).toBe('');

    randomSpy.mockRestore();
  });

  it('should return a list of selected media and an empty error message (scenario 6)', () => {
    let stagedMedia = new StagedMedia(
      [
        new SelectedMedia(
          tdMovies.matrix,
          '',
          MediaType.Movie,
          1651753800,
          9000,
          ['action'],
        ),
        new SelectedMedia(
          tdMovies.interstellar,
          '',
          MediaType.Movie,
          1651766400,
          10800,
          ['scifi'],
        ),
      ],
      [
        new SelectedMedia(tdMovies.inception, '', MediaType.Movie, 0, 9000, [
          'scifi',
        ]),
      ],
      1651777200,
    );
    let media = new Media(
      [tdShows.reboot, tdShows.farscape, tdShows.startrek],
      [
        tdMovies.inception,
        tdMovies.matrix,
        tdMovies.interstellar,
        tdMovies.dune,
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [selectedMedia, error] = streamCon.getStagedStream(
      rightNow,
      config,
      args,
      stagedMedia,
      media,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        1651752000,
        1800,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdMovies.matrix,
        '',
        MediaType.Movie,
        1651753800,
        9000,
        ['action'],
      ),
      new SelectedMedia(
        tdShows.farscape.Episodes[0],
        tdShows.farscape.Title,
        MediaType.Episode,
        1651762800,
        3600,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdMovies.interstellar,
        '',
        MediaType.Movie,
        1651766400,
        10800,
        ['scifi'],
      ),
    ];

    expect(selectedMedia).toEqual(expected);
    expect(error).toBe('');

    randomSpy.mockRestore();
  });

  it('should return a list of selected media and an empty error message (scenario 7)', () => {
    let stagedMedia = new StagedMedia(
      [
        new SelectedMedia(
          tdMovies.matrix,
          '',
          MediaType.Movie,
          1651753800,
          9000,
          ['action'],
        ),
        new SelectedMedia(
          tdMovies.interstellar,
          '',
          MediaType.Movie,
          1651766400,
          10800,
          ['scifi'],
        ),
      ],
      [
        new SelectedMedia(tdMovies.inception, '', MediaType.Movie, 0, 9000, [
          'scifi',
        ]),
      ],
      1651795200,
    );
    let media = new Media(
      [tdShows.reboot, tdShows.farscape, tdShows.startrek],
      [
        tdMovies.inception,
        tdMovies.matrix,
        tdMovies.interstellar,
        tdMovies.dune,
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [selectedMedia, error] = streamCon.getStagedStream(
      rightNow,
      config,
      args,
      stagedMedia,
      media,
      StreamType.Cont,
    );

    let expected = [
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        1651752000,
        1800,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdMovies.matrix,
        '',
        MediaType.Movie,
        1651753800,
        9000,
        ['action'],
      ),
      new SelectedMedia(
        tdShows.farscape.Episodes[0],
        tdShows.farscape.Title,
        MediaType.Episode,
        1651762800,
        3600,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdMovies.interstellar,
        '',
        MediaType.Movie,
        1651766400,
        10800,
        ['scifi'],
      ),
      new SelectedMedia(
        tdMovies.inception,
        '',
        MediaType.Movie,
        1651777200,
        9000,
        ['scifi'],
      ),
      new SelectedMedia(
        tdShows.startrek.Episodes[0],
        tdShows.startrek.Title,
        MediaType.Episode,
        1651786200,
        7200,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdShows.reboot.Episodes[2],
        tdShows.reboot.Title,
        MediaType.Episode,
        1651793400,
        1800,
        ['scifi', 'adventure'],
      ),
    ];

    expect(selectedMedia).toEqual(expected);
    expect(error).toBe('');

    randomSpy.mockRestore();
  });

  it('should return a list of selected media and an empty error message (scenario 8)', () => {
    let stagedMedia = new StagedMedia(
      [
        new SelectedMedia(
          tdMovies.matrix,
          '',
          MediaType.Movie,
          1651753800,
          9000,
          ['action'],
        ),
        new SelectedMedia(
          tdMovies.interstellar,
          '',
          MediaType.Movie,
          1651766400,
          10800,
          ['scifi'],
        ),
      ],
      [
        new SelectedMedia(tdMovies.inception, '', MediaType.Movie, 0, 9000, [
          'scifi',
        ]),
      ],
      1651750200,
    );
    let media = new Media(
      [tdShows.reboot, tdShows.farscape, tdShows.startrek],
      [
        tdMovies.inception,
        tdMovies.matrix,
        tdMovies.interstellar,
        tdMovies.dune,
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [selectedMedia, error] = streamCon.getStagedStream(
      rightNow,
      config,
      args,
      stagedMedia,
      media,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [];

    expect(selectedMedia).toEqual(expected);
    expect(error).toBe('End time needs to be in the future.');

    randomSpy.mockRestore();
  });

  it('should return a list of selected media and an empty error message (scenario 8)', () => {
    let stagedMedia = new StagedMedia(
      [
        new SelectedMedia(
          tdMovies.matrix,
          '',
          MediaType.Movie,
          1651753800,
          9000,
          ['action'],
        ),
        new SelectedMedia(
          tdMovies.interstellar,
          '',
          MediaType.Movie,
          1651766400,
          10800,
          ['scifi'],
        ),
      ],
      [
        new SelectedMedia(tdMovies.inception, '', MediaType.Movie, 0, 9000, [
          'scifi',
        ]),
      ],
      1651766400,
    );
    let media = new Media(
      [tdShows.reboot, tdShows.farscape, tdShows.startrek],
      [
        tdMovies.inception,
        tdMovies.matrix,
        tdMovies.interstellar,
        tdMovies.dune,
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let [selectedMedia, error] = streamCon.getStagedStream(
      rightNow,
      config,
      args,
      stagedMedia,
      media,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [];

    expect(selectedMedia).toEqual(expected);
    expect(error).toBe(
      'End time needs to be after the last scheduled media item.',
    );

    randomSpy.mockRestore();
  });
});
