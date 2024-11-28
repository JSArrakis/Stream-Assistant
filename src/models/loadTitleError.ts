export class LoadTitleError {
  LoadTitle: string;
  Error: string;

  constructor(loadTitle: string, error: string) {
    this.LoadTitle = loadTitle;
    this.Error = error;
  }
}
