import { exec } from "child_process";
const fs = require('fs');

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
export const executeStream = async (vlcLocation: string, sourceDirectory: string, playlistFileName: string): Promise<void> => {
    const cmd: string = `"${vlcLocation}" "${sourceDirectory}${playlistFileName}.m3u"`;
    console.log(cmd);
    await execPromise(cmd);
}



export function createM3UFile(streamPaths: string[], folderLocation: string, fileName: string): void {
    // Combine folder location and file name to get the full file path
    const filePath = `${folderLocation}/${fileName}.m3u`;

    // Create an M3U playlist content by joining the stream paths with newlines
    const playlistContent = streamPaths.join('\n');

    // Write the M3U playlist content to the file
    fs.writeFileSync(filePath, playlistContent);

    console.log(`M3U file "${fileName}.m3u" created in ${folderLocation}`);
}