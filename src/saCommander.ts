import { StreamArgs } from '../models/streamArgs';
const mediaTypes = ["shows", "movies", "shorts", "music", "promos", "commercials",];



export function processCommandLineArgs(): StreamArgs {
    let args = new StreamArgs();
    let options = process.argv.slice(2);
    options.forEach((option) => {
        if (option.includes("--env")) {
            args.env = option.split("=")[1];
        }
        if (option.includes("--durEval")) {
            let evalCandidates = option.split("=")[1].split(" ");
            evalCandidates.forEach(item => {
                if (!mediaTypes.includes(item)) {
                    throw new Error(
                        "Any media types submitted for duration evaluation must be one of the following: shows, movies, shorts, music, promos, commercials"
                    );
                }
            });
            args.durEval = evalCandidates;
        }
        if (option.includes("--movies")) {
            let inputMovies = option.split("=")[1].split(",");
            inputMovies.forEach(item => validateMovie(item));
            let convertedMovies: string[] = []
            inputMovies.forEach(item => {
                let converted = convertValidMovieDateTime(item);
                convertedMovies.push(converted);
            });
            args.movies = convertedMovies;
        }
        if (option.includes("--tagsOR")) {
            args.tagsOR = option.split("=")[1].split(",");
        }
        if (option.includes("--endTime")) {
            let inputEndTime = option.split("=")[1];
            validateInputDateTime(inputEndTime);
            args.endTime = convertToUnixTime(inputEndTime);
        }
        if (option.includes("--startTime")) {
            let inputStartTime = option.split("=")[1];
            validateStartDateTime(inputStartTime);
            args.startTime = convertToUnixTime(inputStartTime);
        }
    });

    return args;
}

export function processInputOptions(inputOptions: any): StreamArgs {
    let args = new StreamArgs();

    if (inputOptions.env) {
        args.env = inputOptions.env;
    }
    if (inputOptions.durEval) {
        let evalCandidates: string[] = inputOptions.durEval
        evalCandidates.forEach(item => {
            if (!mediaTypes.includes(item)) {
                throw new Error(
                    "Any media types submitted for duration evaluation must be one of the following: shows, movies, shorts, music, promos, commercials"
                );
            }
        });
        args.durEval = evalCandidates;
    }
    if (inputOptions.movies) {
        let inputMovies: string[] = inputOptions.movies
        inputMovies.forEach(item => validateMovie(item));
        let convertedMovies: string[] = []
        inputMovies.forEach(item => {
            let converted = convertValidMovieDateTime(item);
            convertedMovies.push(converted);
        });
        args.movies = convertedMovies;
    }
    if (inputOptions.tagsOR) {
        args.tagsOR = inputOptions.tagsOR;
    }
    if (inputOptions.endTime) {
        let inputEndTime: string = inputOptions.endTime
        validateInputDateTime(inputEndTime);
        args.endTime = convertToUnixTime(inputEndTime);
    }
    if (inputOptions.startTime) {
        let inputStartTime: string = inputOptions.startTime
        validateStartDateTime(inputStartTime);
        args.startTime = convertToUnixTime(inputStartTime);
    }
    return args;
}

export function validateInputDateTime(dateString: string): void {
    let validDateTime = /^\d{4}-(0[1-9]|1[0-2])-\d{2}T([01]\d|2[0-3]):([03]0)$/gmi
    if (!validDateTime.test(dateString)) {
        throw new Error(
            "Any times submitted must conform to the format of e.g. 2022-01-01T00:00"
        );
    }
    let date = new Date(dateString);

    // Check if the parsed date is valid
    if (isNaN(date.getTime())) {
        throw new Error(
            "${dateString} is not a valid date. Please use the format YYYY-MM-DDTHH:MM e.g. 2022-01-01T00:00"
        );
    }
}

export function validateStartDateTime(dateString: string): void {
    let validDateTime = /^\d{4}-(0[1-9]|1[0-2])-\d{2}T([01]\d|2[0-3]):([0-5]\d)$/gmi

    if (!validDateTime.test(dateString)) {
        throw new Error(
            "Any times submitted must conform to the format of e.g. 2022-01-01T00:00"
        );
    }
    let date = new Date(dateString);

    // Check if the parsed date is valid
    if (isNaN(date.getTime())) {
        throw new Error(
            "${dateString} is not a valid date. Please use the format YYYY-MM-DDTHH:MM e.g. 2022-01-01T00:00"
        );
    }
}

export function validateMovie(movie: string): void {
    let scheduledMovie = /^[a-zA-Z0-9_]*::\d{4}-(0[1-9]|1[0-2])-\d{2}T([01]\d|2[0-3]):([03]0)$/gmi
    let injectedMovie = /^[a-zA-Z0-9_]*$/gmi;
    if (!scheduledMovie.test(movie) && !injectedMovie.test(movie)) {
        throw new Error(
            "Any movies submitted must conform to the format of LoadTitle or LoadTitle::UnixTimeStamp e.g. themummy::1670191200"
        );
    }
};

export function convertValidMovieDateTime(movie: string): string {
    if (movie.includes("::")) {
        let timesplit = movie.split("::");

        // Convert the Date object to a Unix timestamp (milliseconds since Jan 1, 1970)
        let timestamp = convertToUnixTime(timesplit[1]);
        return `${timesplit[0]}::${timestamp}`;
    } else {
        return movie;
    }
}

function convertToUnixTime(dateString: string): number {
    let [datePart, timePart] = dateString.split('T');
    let [year, month, day] = datePart.split('-').map(Number);
    let [hour, minute] = timePart.split(':').map(Number);

    // Create a Date object with the extracted values
    let date = new Date(year, month - 1, day, hour, minute); // Month is 0-based

    // Convert the Date object to a Unix timestamp (milliseconds since Jan 1, 1970)
    return Math.floor(date.getTime() / 1000);
}
