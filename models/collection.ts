import { BaseMedia } from "./baseMedia";
import { Bumper } from "./bumper";
import { Promo } from "./promo";
import { Episode } from "./show";

export class Collection extends BaseMedia {
    Title: string;
    LoadTitle: string;
    Type: string;
    Duration: number;
    DurationLimit: number;
    Tags: string[];
    StartBumper: Bumper;
    EndBumper: Bumper;
    Promos: Promo[];
    Shows: CollectionShow[];
}

class CollectionShow {
    LoadTitle: string;
    Sequence: number;
    Subsequence: number;
    DurationLimit: number;
    BumperStart?: Bumper
    BumperEnd?: Bumper;
    Episode?: Episode;
}