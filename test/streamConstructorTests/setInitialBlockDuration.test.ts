import * as streamCon from '../../src/services/streamConstructor';

describe('setInitialBlockDuration', () => {
  it('should return the duration of the first procedural block (scenario 1)', () => {
    const rightNow = 1651750471;
    const firstTimePoint = 1651752000;
    const duration = firstTimePoint - rightNow;

    let [preMediaDuration, initialProceduralBlockDuration] =
      streamCon.setInitialBlockDuration(1800, duration);
    expect(preMediaDuration).toBe(1529);
    expect(initialProceduralBlockDuration).toBe(0);
  });

  it('should return the duration of the first procedural block (scenario 2)', () => {
    const rightNow = 1651750471;
    const firstTimePoint = 1651755600;
    const duration = firstTimePoint - rightNow;

    let [preMediaDuration, initialProceduralBlockDuration] =
      streamCon.setInitialBlockDuration(1800, duration);
    expect(preMediaDuration).toBe(1529);
    expect(initialProceduralBlockDuration).toBe(3600);
  });

  it('should return the duration of the first procedural block (scenario 3)', () => {
    const rightNow = 1651752000;
    const firstTimePoint = 1651755600;
    const duration = firstTimePoint - rightNow;

    let [preMediaDuration, initialProceduralBlockDuration] =
      streamCon.setInitialBlockDuration(1800, duration);
    expect(preMediaDuration).toBe(0);
    expect(initialProceduralBlockDuration).toBe(3600);
  });
});
