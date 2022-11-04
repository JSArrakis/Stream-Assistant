'use strict';
const dirMan = require("./directoryManager.js");

exports.clipSelector = (path, type) => {
    let clipList = [];
    let clipFolders = dirMan.getDirectoryItems(path)
    clipFolders.forEach(folder => {
        let clipNames = dirMan.getDirectoryItems(path + folder);
        clipNames.forEach(name => {
            let clip = {
                "path": path + folder + "\\" + name,
                "type": type,
                "duration": parseInt(folder)
            }
            clipList.push(clip);
        });
    });
    return clipList
}