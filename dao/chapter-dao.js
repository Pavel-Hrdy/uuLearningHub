"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

// path to default storage - must be separated between chapters and subchapters!
const DEFAULT_STORAGE_PATH = path.join(__dirname, "..", "storage", "chapters.json");


class ChapterDao {
  constructor(storagePath=DEFAULT_STORAGE_PATH) {
    this._videoStoragePath = storagePath;
  }

  // object with property chapterOrderNumber assigned as parameter --> object from chapter DB with chapter name returned
  async getChapter(object) {
    const chapterOrderNumber = object.chapterOrderNumber;
    const chapters = await this._loadAllChapters();
    const chapter = chapters.find(chapter => {return chapter.chapterOrderNumber === chapterOrderNumber;});
    return chapter;
  }

  // object with property sub/chapterOrderNumber assigned as parameter --> object from chapter DB with subchapter name returned
  async getSubchapter(object) {
    const chapterOrderNumber = object.chapterOrderNumber;
    const subchapterOrderNumber = object.subchapterOrderNumber;
    const chapterList = await this._loadAllChapters();
    const currentChapter = chapterList.find(chapter => {return chapter.chapterOrderNumber === chapterOrderNumber});
    const subchapter = currentChapter.subchapters.find(subchapter => {return subchapter.subchapterOrderNumber === subchapterOrderNumber})
    return subchapter;   
  }

  async getAllChapters() {
    const chapterList = await this._loadAllChapters();
    return chapterList;
  }
  
  // Returns storage path
  _getStorageLocation() {
    return this._videoStoragePath;
  }

  // Loading all chapters from the DB and returns them as an array of objects
  async _loadAllChapters() {
    let chapters;
    try {
      chapters = JSON.parse(await rf(path.join(this._getStorageLocation())));
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.info("No storage found, initializing new one.");
        chapters = [];
      } else {
        throw new Error("Unable to read from storage. Wrong data format in storage: " + path.join(this._getStorageLocation()));
      }
    }
    return chapters;
  }


}

module.exports = ChapterDao; 