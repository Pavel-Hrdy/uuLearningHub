"use strict";

const path = require("path");

const TagDao = require(path.join(__dirname, "..", "..", "dao", "tag-dao.js"));
const VideoDao = require(path.join(__dirname, "..", "..", "dao", "video-dao.js"));

const tagDao = new TagDao(path.join(__dirname, "..", "..", "storage", "tags.json"));
const videoDao = new VideoDao(path.join(__dirname, "..", "..", "storage", "videos.json"));


async function ListVideosAbl(req, res) {
  // creating filter map for the videos
  try {
    let id = req.body.id;
    if (await tagDao.getTag(id)) {
      let videos = await videoDao.listVideos({"tag": id});
      return res.json(videos);
    } else {
      return res.status(400).json("Given Tag doesn't exist!");
    }
  } catch (e) {
    return res.status(500).json({
      "error": e.message
    })
  }
}

module.exports = ListVideosAbl;
