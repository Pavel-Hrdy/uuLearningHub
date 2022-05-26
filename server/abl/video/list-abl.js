"use strict";

const path = require("path");

const VideoDao = require(path.join(__dirname, "..", "..", "dao", "video-dao.js"));
const TagDao = require(path.join(__dirname, "..", "..", "dao", "tag-dao.js"));

const videoDao = new VideoDao(path.join(__dirname, "..", "..", "storage", "videos.json"));
const tagDao = new TagDao(path.join(__dirname, "..", "..", "storage", "tags.json"));


async function ListAbl(req, res) {
  // creating filter map for the videos
  let searchMap = {};
  try {
    const chapterPath = req.query.chapter;
    // if the chapter is specified in the query and it's format matches following regex...
    if (chapterPath && chapterPath.match(/\d+-\d+/)) {
      // ...two properties are added to the filter map 
      const [chapter, subchapter] = chapterPath.split("-");
      searchMap.chapter = chapter;
      searchMap.subchapter = subchapter;
    }
    let tag = req.query.tag;
    // if the tag is specified in the query...
    if (tag) {
      // ... tag property is added to the filter map
      if (await tagDao.getTagByName(tag)) {
        tag = await tagDao.getTagByName(tag);
        searchMap.tag = tag.id;
      } else {
        return res.status(400).json({
        "error": `Given tag ${tag} doesn't exist!`
        })
      }
    }
    let fulltext = req.query.fulltext
    if (fulltext) {
      fulltext = fulltext.toLowerCase().replace(/\+/g, " ");
      searchMap.fulltext = fulltext;
    }
    let videos = await videoDao.listVideos(searchMap);
    
    return res.json(videos);
    
  } catch (e) {
    return res.status(500).json({
      "error": e.message
    })
  }
}

module.exports = ListAbl;
