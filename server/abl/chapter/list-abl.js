"use strict";

const path = require("path");

const ChapterDao = require(path.join(__dirname, "..", "..", "dao", "chapter-dao.js"));

const chapterDao = new ChapterDao(path.join(__dirname, "..", "..", "storage", "chapters.json"));


async function ListAbl(req, res) {
  try {
      const chapters = await chapterDao.getAllChapters();
      return res.json(chapters)
  }
  catch (e) {
    return res.status(500).json({
      "error": e.message
      }
    )
  }
}

module.exports = ListAbl;
