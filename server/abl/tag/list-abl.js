"use strict";

const path = require("path");

const TagDao = require(path.join(__dirname, "..", "..", "dao", "tag-dao.js"));

const tagDao = new TagDao(path.join(__dirname, "..", "..", "storage", "tags.json"));


async function ListAbl(req, res) {
  // creating filter map for the videos
  let searchMap = {};
  try {
    let substring = req.body.search;
    let videos = await tagDao.listTags(substring);
    
    return res.json(videos);
    
  } catch (e) {
    return res.status(500).json({
      "error": e.message
    })
  }
}

module.exports = ListAbl;
