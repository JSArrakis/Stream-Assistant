import minimist from "minimist";

const validateBlock = (block: string) => {
    if (!/^[a-zA-Z0-9_]*::[0-9]*$/gmi.test(block)) {
        throw new Error(
            "Any blocks submitted must conform to the format of Title::UnixTimeStamp e.g. Toonami2k::1670191200 where Title is the title of the block you wish to create and Time is the time in 24 time for your system's local time. See the param --BlockList for all possible blocks available with their descriptions."
        );
    }
};

const validateMovie = (movie: string) => {
    if (
        !/^[a-zA-Z0-9_]*::[0-9]*$/gmi.test(movie) &&
        !/^[a-zA-Z0-9_]*$/gmi.test(movie)
    ) {
        throw new Error(
            "Any movies submitted must conform to the format of LoadTitle or LoadTitle::UnixTimeStamp e.g. themummy::1670191200"
        );
    }
};

const validateTag = (tag: string) => {
    if (!/^(\([a-z0-9]+(?:,[a-z0-9]+)*\))$/gm.test(tag)) {
        throw new Error(
            "Each tag combo must be comma separated with no spaces e.g. scifi,80s,horror"
        );
    }
};

interface CommandLineArgs {
    env?: string;
    movies?: string[];
    tagsOR?: string[];
    tagsAND?: string[];
    blocks?: string[];
    endTime?: string;
}

export function parseCommandLineArgs(): CommandLineArgs {
    const args = minimist(process.argv.slice(2), {
        string: ["env", "endTime"],
        alias: {
            env: "e",
            movies: "m",
            tagsOR: "t",
            tagsAND: "T",
            blocks: "b",
            endTime: "E",
        },
    });

    if (args.blocks) {
        args.blocks.forEach(validateBlock);
    }

    if (args.movies && args.movies.length > 0) {
        args.movies.forEach(validateMovie);
    }

    if (args.tagsAND) {
        args.tagsAND.forEach(validateTag);
    }

    if (!(args.blocks || args.endTime)) {
        if (args.movies && args.movies.length > 0) {
            let hasScheduledMovies = false;
            args.movies.forEach((m: string) => {
                if (m.includes("::")) {
                    hasScheduledMovies = true;
                }
            });
            if (hasScheduledMovies === false) {
                throw new Error(
                    "The stream must be set up with a stream duration, a block or movie with a set time, or an end time"
                );
            }
        } else {
            throw new Error(
                "The stream must be set up with a stream duration, a block or movie with a set time, or an end time"
            );
        }
    }

    return args;
}
