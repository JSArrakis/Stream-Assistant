import { SegmentedTags } from '../../src/models/segmentedTags';
import { segmentTags } from '../../src/services/dataTransformer';

describe('tagTranslator', () => {
  it('should return an empty TranslatedTags object when given an empty tags array', () => {
    const tags: string[] = [];
    const expectedSegmentedTags: SegmentedTags = new SegmentedTags(
      [],
      [],
      [],
      [],
      [],
    );

    const result: SegmentedTags = segmentTags(tags);

    expect(result).toEqual(expectedSegmentedTags);
  });

  it('should return a TranslatedTags object when tags are provided (scenario 1)', () => {
    const tags: string[] = [
      'scifi',
      'animated',
      'adventure',
      'cgi',
      'kids',
      '1990s',
    ];
    const expectedSegmentedTags: SegmentedTags = new SegmentedTags(
      ['1990s'],
      ['scifi', 'adventure'],
      ['animated', 'cgi'],
      ['kids'],
      [],
    );

    const result: SegmentedTags = segmentTags(tags);

    expect(result).toEqual(expectedSegmentedTags);
  });
});
