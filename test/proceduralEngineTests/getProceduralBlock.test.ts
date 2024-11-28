import * as proEng from '../../src/services/proceduralEngine';
import * as proMan from '../../src/services/progressionManager';
import { Movie } from '../../src/models/movie';
import { ContStreamRequest } from '../../src/models/streamRequest';
import { StreamType } from '../../src/models/enum/streamTypes';
import { StagedMedia } from '../../src/models/stagedMedia';
import { Media } from '../../src/models/media';
import { SelectedMedia } from '../../src/models/selectedMedia';
import { MediaType } from '../../src/models/enum/mediaTypes';
import * as td from '../testData/testData';

describe('getProceduralBlock', () => {
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

  it('should fill the procedural block with available media (scenario 1)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
    let media = new Media(
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
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
        td.reboot.Episodes[1],
        td.reboot.Title,
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
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
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
        td.farscape.Episodes[0],
        td.farscape.Title,
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
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
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
        td.reboot.Episodes[1],
        td.reboot.Title,
        MediaType.Episode,
        latestTimePoint,
        1800,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        td.reboot.Episodes[2],
        td.reboot.Title,
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
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
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
        td.farscape.Episodes[0],
        td.farscape.Title,
        MediaType.Episode,
        latestTimePoint,
        3600,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        td.reboot.Episodes[1],
        td.reboot.Title,
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
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
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
        td.reboot.Episodes[1],
        td.reboot.Title,
        MediaType.Episode,
        latestTimePoint,
        1800,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        td.reboot.Episodes[2],
        td.reboot.Title,
        MediaType.Episode,
        latestTimePoint + 1800,
        1800,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        td.reboot.Episodes[3],
        td.reboot.Title,
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
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
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
        td.startrek.Episodes[0],
        td.startrek.Title,
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
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
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
      new SelectedMedia(td.matrix, '', MediaType.Movie, latestTimePoint, 9000, [
        'action',
      ]),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 8)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
    let media = new Media(
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
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
      new SelectedMedia(td.dune, '', MediaType.Movie, latestTimePoint, 10800, [
        'scifi',
      ]),
    ];

    expect(proceduralBlock).toEqual(expected);
    randomSpy.mockRestore();
  });

  it('should fill the procedural block with available media (scenario 9)', () => {
    let stagedMedia = new StagedMedia([], [], 0);
    let media = new Media(
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    let prevMovies: Movie[] = [td.dune];
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
        td.interstellar,
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
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    let prevMovies: Movie[] = [td.interstellar, td.dune];
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
      new SelectedMedia(td.matrix, '', MediaType.Movie, latestTimePoint, 9000, [
        'action',
      ]),
      new SelectedMedia(
        td.reboot.Episodes[1],
        td.reboot.Title,
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
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    let prevMovies: Movie[] = [
      td.inception,
      td.matrix,
      td.interstellar,
      td.dune,
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
        td.startrek.Episodes[0],
        td.startrek.Title,
        MediaType.Episode,
        latestTimePoint,
        7200,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        td.startrek.Episodes[1],
        td.startrek.Title,
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
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    let prevMovies: Movie[] = [td.interstellar, td.dune];
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
      new SelectedMedia(td.matrix, '', MediaType.Movie, latestTimePoint, 9000, [
        'action',
      ]),
      new SelectedMedia(
        td.inception,
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
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    let prevMovies: Movie[] = [td.interstellar, td.dune];
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
      new SelectedMedia(td.matrix, '', MediaType.Movie, latestTimePoint, 9000, [
        'action',
      ]),
      new SelectedMedia(
        td.inception,
        '',
        MediaType.Movie,
        latestTimePoint + 9000,
        9000,
        ['scifi'],
      ),
      new SelectedMedia(
        td.startrek.Episodes[0],
        td.startrek.Title,
        MediaType.Episode,
        latestTimePoint + 18000,
        7200,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        td.reboot.Episodes[1],
        td.reboot.Title,
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
        new SelectedMedia(td.inception, '', MediaType.Movie, 0, 9000, [
          'scifi',
        ]),
        new SelectedMedia(td.interstellar, '', MediaType.Movie, 0, 10800, [
          'scifi',
        ]),
      ],
      0,
    );
    let media = new Media(
      [td.reboot, td.farscape, td.startrek],
      [td.inception, td.matrix, td.interstellar, td.dune],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
    let prevMovies: Movie[] = [td.interstellar, td.dune];
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
        td.inception,
        '',
        MediaType.Movie,
        latestTimePoint,
        9000,
        ['scifi'],
      ),
      new SelectedMedia(
        td.matrix,
        '',
        MediaType.Movie,
        latestTimePoint + 9000,
        9000,
        ['action'],
      ),
      new SelectedMedia(
        td.startrek.Episodes[0],
        td.startrek.Title,
        MediaType.Episode,
        latestTimePoint + 18000,
        7200,
        ['scifi', 'adventure'],
      ),
      new SelectedMedia(
        td.reboot.Episodes[1],
        td.reboot.Title,
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
