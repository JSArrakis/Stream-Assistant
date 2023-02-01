'use strict';
const fs = require("fs");

const makeDirectory = async (directory) => {
    await fs.promises.mkdir(directory, (err) => {
        if (err) throw err;
    });
    console.log(directory + " Created");
}

const deleteFile = async (file) => {
    await fs.promises.unlink(file, err => {
        if (err) throw err
    });
    console.log(file + " Deleted");
}

const fileWasCreatedToday = async (path, testing) => {
    var today = new Date;
    try {
        //Get Destination Directory Stats
        return await fs.promises.stat(path, (err, stats) => {
            if (err) throw err;
            return stats;
        }).then((parsedStats) => {
            //Then Compare if the creation date of the file is the same as today's date
            if (testing) {
                return false;
            } else {
                return parsedStats.birthtime.toDateString() === today.toDateString();
            }
        });
    } catch (err) {
        console.error('Error occurred while attempting to compare file dates!', err);
    }
}

exports.manageDestinationDirectory = async (config, destinationDirectory, options) => {
    //First Check if Destination Directory Exists
    let playlistFileName = config.PlaylistName;
    try {

        if (options.test) { console.log("WARNING - TESTING IS ON"); }

        if (fs.existsSync(destinationDirectory)) {
            console.log("FOLDER EXISTS");
            if (fs.existsSync(destinationDirectory + playlistFileName + '.m3u')) {
                console.log(destinationDirectory + playlistFileName + '.m3u' + " exists!")
                //If the Directory already exists check it's Create Date and compare it to current Date
                if (await fileWasCreatedToday(destinationDirectory + playlistFileName + '.m3u', options.test)) {
                    //If the directory was created today, Do nothing
                    return false;

                } else {
                    //If the Directory wasn't created today, delete the directory 
                    //Create a new directory in preparation for today's show line up
                    console.log("Resetting Playlist file.");
                    await deleteFile(destinationDirectory + playlistFileName + '.m3u');
                    return true;
                }
            } else {
                return true;
            }
        }
        else {
            console.log(destinationDirectory + " not found!")
            console.log("Creating Destination Directory");
            //If the Directory doesn't exist, Create Directory
            await makeDirectory(destinationDirectory);
            return true;
        }
    } catch (err) {
        console.error('Error occurred while attempting to create or delete the destination directory!', err);
    }
}

exports.createProgressionFile = async (destinationDirectory, progression) => {
    return await fs.promises.writeFile(destinationDirectory + 'progression.json', JSON.stringify(progression),
        (err) => {
            if (err) throw err;
            console.log('Progression File was not created successfully.');
        });
}

exports.createScheduleFile = async (destinationDirectory, programming) => {
    const newline = "\r\n";
    let formattedSchedule = [];
    programming.forEach(item => {
        formattedSchedule.push("<t:" + item.mediaStartTime + ":F>");
        formattedSchedule.push(item.mediaName);
        formattedSchedule.push(" ")
    })
    return await fs.promises.writeFile(destinationDirectory + 'programming.txt', formattedSchedule.join(newline),
        (err) => {
            if (err) throw err;
            console.log('Stream file was not created successfully.');
        });
}

exports.getDirectoryItems = (path) => {
    return fs.readdirSync(path);
}

exports.directoryExists = (path) => {
    return fs.existsSync(path);
}

exports.readFile = (path) => {
    return fs.readFileSync(path);
}

exports.createStreamFile = async (destinationDirectory, playlistFileName, stream) => {
    const newline = "\r\n";
    return await fs.promises.writeFile(destinationDirectory + playlistFileName + '.m3u', stream.join(newline),
        (err) => {
            if (err) throw err;
            console.log('Stream file was not created successfully.');
        });
}

exports.createOutputMediaListFile = async (destinationDirectory, mediaList, fileName) => {
    console.log("Creating output movie list file");
    return await fs.promises.writeFile(destinationDirectory + fileName, JSON.stringify(mediaList),
        (err) => {
            if (err) throw err;
            console.log('Progression File was not created successfully.');
        });
}