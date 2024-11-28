import * as proEng from '../../src/services/proceduralEngine';
import * as proMan from '../../src/services/progressionManager';
import { Movie } from '../../src/models/movie';
import { ContStreamRequest } from '../../src/models/streamRequest';
import { StreamType } from '../../src/models/enum/streamTypes';
import { StagedMedia } from '../../src/models/stagedMedia';
import { Media } from '../../src/models/media';
import { SelectedMedia } from '../../src/models/selectedMedia';
import { MediaType } from '../../src/models/enum/mediaTypes';
import * as tdProgression from '../testData/progression';
import * as tdMovies from '../testData/movies';
import * as tdShows from '../testData/shows';

describe('getProceduralBlock', () => {
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

  it('should fill the procedural block with available media (scenario 1)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      1800,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        latestTimePoint,
        1800,
        ['scifi', 'adventure'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 2)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      3600,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdShows.farscape.Episodes[0],
        tdShows.farscape.Title,
        MediaType.Episode,
        latestTimePoint,
        3600,
        ['scifi', 'adventure'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 3)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      3600,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        latestTimePoint,
        1800,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdShows.reboot.Episodes[2],
        tdShows.reboot.Title,
        MediaType.Episode,
        latestTimePoint + 1800,
        1800,
        ['scifi', 'adventure'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 4)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      5400,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdShows.farscape.Episodes[0],
        tdShows.farscape.Title,
        MediaType.Episode,
        latestTimePoint,
        3600,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        latestTimePoint + 3600,
        1800,
        ['scifi', 'adventure'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 5)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      5400,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        latestTimePoint,
        1800,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdShows.reboot.Episodes[2],
        tdShows.reboot.Title,
        MediaType.Episode,
        latestTimePoint + 1800,
        1800,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdShows.reboot.Episodes[3],
        tdShows.reboot.Title,
        MediaType.Episode,
        latestTimePoint + 3600,
        1800,
        ['scifi', 'adventure'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 6)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      7200,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdShows.startrek.Episodes[0],
        tdShows.startrek.Title,
        MediaType.Episode,
        latestTimePoint,
        7200,
        ['scifi', 'adventure'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 7)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      9000,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(tdMovies.matrix, '', MediaType.Movie, latestTimePoint, 9000, [
        'action',
      ]),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 8)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      10800,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdMovies.dune,
        '',
        MediaType.Movie,
        latestTimePoint,
        10800,
        ['scifi'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 9)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [tdMovies.dune];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      10800,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdMovies.interstellar,
        '',
        MediaType.Movie,
        latestTimePoint,
        10800,
        ['scifi'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 9)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [tdMovies.interstellar, tdMovies.dune];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      10800,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdMovies.matrix,
        '',
        MediaType.Movie,
        latestTimePoint,
        9000,
        ['action'],
      ),
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        latestTimePoint + 9000,
        1800,
        ['scifi', 'adventure'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 9)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [
      tdMovies.inception,
      tdMovies.matrix,
      tdMovies.interstellar,
      tdMovies.dune,
    ];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      10800,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdShows.startrek.Episodes[0],
        tdShows.startrek.Title,
        MediaType.Episode,
        latestTimePoint,
        7200,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdShows.startrek.Episodes[1],
        tdShows.startrek.Title,
        MediaType.Episode,
        latestTimePoint + 7200,
        3600,
        ['scifi', 'adventure'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 10)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [tdMovies.interstellar, tdMovies.dune];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      18000,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdMovies.matrix,
        '',
        MediaType.Movie,
        latestTimePoint,
        9000,
        ['action'],
      ),
      new SelectedMedia(
        tdMovies.inception,
        '',
        MediaType.Movie,
        latestTimePoint + 9000,
        9000,
        ['scifi'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 11)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
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
    let prevMovies: Movie[] = [tdMovies.interstellar, tdMovies.dune];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      27000,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdMovies.matrix,
        '',
        MediaType.Movie,
        latestTimePoint,
        9000,
        ['action'],
      ),
      new SelectedMedia(
        tdMovies.inception,
        '',
        MediaType.Movie,
        latestTimePoint + 9000,
        9000,
        ['scifi'],
      ),
      new SelectedMedia(
        tdShows.startrek.Episodes[0],
        tdShows.startrek.Title,
        MediaType.Episode,
        latestTimePoint + 18000,
        7200,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        latestTimePoint + 25200,
        1800,
        ['scifi', 'adventure'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 12)', () => {
    let stagedMedia = new StagedMedia(
      [],
      [
        new SelectedMedia(tdMovies.inception, '', MediaType.Movie, 0, 9000, [
          'scifi',
        ]),
        new SelectedMedia(
          tdMovies.interstellar,
          '',
          MediaType.Movie,
          0,
          10800,
          ['scifi'],
        ),
      ],
      0,
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
    let prevMovies: Movie[] = [tdMovies.interstellar, tdMovies.dune];
    let latestTimePoint = 1722816000;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    let proceduralBlock = proEng.getProceduralBlock(
      args,
      stagedMedia,
      media,
      prevMovies,
      27000,
      latestTimePoint,
      StreamType.Cont,
    );

    let expected: SelectedMedia[] = [
      new SelectedMedia(
        tdMovies.inception,
        '',
        MediaType.Movie,
        latestTimePoint,
        9000,
        ['scifi'],
      ),
      new SelectedMedia(
        tdMovies.matrix,
        '',
        MediaType.Movie,
        latestTimePoint + 9000,
        9000,
        ['action'],
      ),
      new SelectedMedia(
        tdShows.startrek.Episodes[0],
        tdShows.startrek.Title,
        MediaType.Episode,
        latestTimePoint + 18000,
        7200,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        tdShows.reboot.Episodes[1],
        tdShows.reboot.Title,
        MediaType.Episode,
        latestTimePoint + 25200,
        1800,
        ['scifi', 'adventure'],
      ),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });
});
