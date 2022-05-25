"use strict";

const path = require("path");

const ChapterDao = require(path.join(__dirname, "..", "..", "dao", "chapter-dao.js"));

const chapterDao = new ChapterDao(path.join(__dirname, "..", "..", "storage", "chapters.json"));

async function GetAbl(req, res) {
  let searchedObject;
  try {
    let id = req.params.id;
    if (id.match(/^\d+$/)) {
      let chapterSchema = {};
      chapterSchema.chapterOrderNumber = id;
      const chapter = await chapterDao.getChapter(chapterSchema);
      searchedObject = chapter;
    }
    else if (id.match(/^\d+-\d+$/)) {
      let chapterSchema = {};
      let parsedSchema = id.split("-");
      chapterSchema.chapterOrderNumber = parsedSchema[0];
      chapterSchema.subchapterOrderNumber = parsedSchema[1];
      const subchapter = await chapterDao.getSubchapter(chapterSchema);
      searchedObject = subchapter;
    }
    if (!searchedObject) {
      return res.status(400).json({
        "error": "Chapter number doesn't exist!"
    })
    } else {
      return res.json(searchedObject);
    }


  } catch (e) {
    return res.status(500).json({
      "error": e.message
      }
    )
  }
}

module.exports = GetAbl;
