import { MediaProgression, ShowProgression } from "../models/mediaProgression";
import { SelectedMedia } from "../models/selectedMedia";
import { Show } from "../models/show";

export function getRandomMedia(objects: SelectedMedia[]): SelectedMedia {
    const randomIndex = Math.floor(Math.random() * objects.length);
    return objects[randomIndex];
}

export function ManageProgression(title: string, type: string, progression: MediaProgression[], show: Show, numOfEpsRequested: number): number[] {
    let episodeNumbers: number[] = []

    addProgression(title, type, progression, show)

    for (let i = 0; i < numOfEpsRequested; i++) {
        let progContext: MediaProgression = progression
            .filter(prog => prog.Title === title)[0];
        let episode = progContext.Shows.filter(item => item.LoadTitle === show.LoadTitle)[0].Episode;
        episodeNumbers.push(episode);
        incrementProgression(progression, title, show);
    }
    return episodeNumbers;
}

export function ReduceProgression(title: string, showLoadTitle: string, progression: MediaProgression[]) {
    progression.filter(pitem => pitem.Title === title)[0].Shows
        .filter(fshow => fshow.LoadTitle === showLoadTitle)
        .forEach(sitem => {
            sitem.Episode = sitem.Episode - 1;
        });
}

export function incrementProgression(progression: MediaProgression[], title: string, show: Show) {
    progression.filter(pitem => pitem.Title === title)[0].Shows
        .filter(fshow => fshow.LoadTitle === show.LoadTitle)
        .forEach(sitem => {
            sitem.Episode++;
            if (sitem.Episode > show.EpisodeCount) {
                sitem.Episode = 1;
            }
        });
}

export function addProgression(title: string, type: string, progression: MediaProgression[], show: Show) {
    let showProg = new ShowProgression(show.LoadTitle, 1)
    let progItem = new MediaProgression(title, type, [showProg])


    let progressionItem: MediaProgression[] = progression
        .filter(prog => prog.Title === title)

    if (progressionItem.length === 0) {
        progression.push(progItem)
    }

    let selectedShowProgression: ShowProgression[] = progression
        .filter(prog => prog.Title === title)[0].Shows
        .filter(selShow => selShow.LoadTitle == show.LoadTitle);

    if (selectedShowProgression.length === 0) {
        progression.filter(pitem => pitem.Title === title)[0].Shows
            .push(showProg);
    }
}

export function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // primitive value or null
    }

    if (Array.isArray(obj)) {
        return obj.map(deepCopy); // array
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = deepCopy(value); // object
    }

    return result;
}
