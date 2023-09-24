import { Collection } from "./collection";
import { Commercial } from "./commercial";
import { Movie } from "./movie";
import { Music } from "./music";
import { Promo } from "./promo";
import { Short } from "./short";
import { Episode } from "./show";

export class MediaBlock {
    Buffer: (Promo | Music | Commercial | Short)[];
    MainBlock?: (Episode | Movie | Collection);
    InitialBuffer: (Promo | Music | Commercial | Short)[];

    constructor(buffer: (Promo | Music | Commercial | Short)[], initialBuffer: (Promo | Music | Commercial | Short)[], mainBlock?: (Episode | Movie | Collection)) {
        this.Buffer = buffer;
        this.MainBlock = mainBlock;
        this.InitialBuffer = initialBuffer;
    }
}