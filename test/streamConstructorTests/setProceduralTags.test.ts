import { MediaType } from "../../src/models/enum/mediaTypes";
import { IStreamRequest } from '../../src/models/streamRequest';
import { SelectedMedia } from "../../src/models/selectedMedia";
import { StagedMedia } from '../../src/models/stagedMedia';
import * as streamCon from "../../src/services/streamConstructor";
import * as td from "../testData/testData";

describe('setProceduralTags', () => {
    it('should populate the tags array of the args object with the tags of the selected media if the args tags array is empty', () => {
        let args: IStreamRequest = {
            Title: "Example Title",
            Env: "production",
            Movies: ['inception::1656547200', 'interstellar::1656633600'],
            Tags: [],
            MultiTags: [],
            Collections: [],
            StartTime: 1656547200,
            Password: "securepassword"
        };

        const selected = [
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.matrix, '', MediaType.Movie, 1656633600, 10800, ["action"])
        ];

        const stagedMedia = new StagedMedia(selected, [], 1656633600 + 10800);
        streamCon.setProceduralTags(args, stagedMedia);

        expect(args.Tags).toEqual(["scifi", "action"]);
    });
});