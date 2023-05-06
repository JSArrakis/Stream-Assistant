import { exec } from "child_process";

/**
 * @param {string} cmd Console command string to execute via child process in commandline  
 */
const execPromise = (cmd: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout) => {
            if (err) return reject(err);
            resolve(stdout);
        });
    });
}

/**
 * @param {string} vlcLocation Directory location of VLC on the system running this application
 * @param {string} sourceDirectory Directory in which playlist m3u file exists to execute
 * @param {string} playlistFileName Name of the playlist file to execute
 */
export function executeStream(vlcLocation: string, sourceDirectory: string, playlistFileName: string): void {
    let consoleCommand = ["cd " + vlcLocation + " && vlc.exe " + sourceDirectory + playlistFileName + '.m3u'];

    consoleCommand.reduce((p, cmd) => {
        return p.then(() => {
            return execPromise(cmd);
        });
    }, Promise.resolve()).then((results) => {
        console.log(results);
    }, (err) => {
        if (err) throw err;
    });
}
