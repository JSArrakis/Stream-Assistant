export class SegmentedTags {
  EraTags: string[];
  GenreTags: string[];
  SpecialtyTags: string[];
  AgeGroupTags: string[];
  HolidayTags: string[];

  constructor(
    eraTags: string[],
    genreTags: string[],
    specialtyTags: string[],
    ageGroupTags: string[],
    holidayTags: string[],
  ) {
    this.EraTags = eraTags;
    this.GenreTags = genreTags;
    this.SpecialtyTags = specialtyTags;
    this.AgeGroupTags = ageGroupTags;
    this.HolidayTags = holidayTags;
  }
}
