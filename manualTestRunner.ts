// This manual test runner is constructed to run tests as Jest
// is not displaying console logs in the code

// Change the import to the test you want to run
import { AgeGroups } from './src/models/const/ageGroups';
import { Eras } from './src/models/const/eras';
import { BaseMedia } from './src/models/mediaInterface';
import {
    getMediaByTagGroupHeirarchy,
} from './src/services/dataManager';
import * as td from "./test/testData/testData";

const exampleMedia: BaseMedia[] = [
    // Add your media objects here
];

function runTests() {

            const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [
            td.littleoopsiedaisy,
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.transformers80s1,
            td.alientrailer1,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
        ];
        const tags: string[] = [
            "jurassicpark",
            "transformers",
        ];
        const eraTags: string[] = [
            Eras.nnineties,
        ];
        const age: string = AgeGroups.Kids;
        const duration: number = 30;

        const expectedMedia: BaseMedia[] = [
            td.jurassicparktoys1,
            td.jurassicparktoys2,
            td.jurassicparktoys3,
            td.transformersbeastwarstoys,
        ];

        const result: BaseMedia[] =
           getMediaByTagGroupHeirarchy(
                alreadySelectedMedia,
                media,
                tags,
                eraTags,
                age,
                duration
            );
}

runTests();