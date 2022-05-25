"use strict";

const path = require("path");

const VideoDao = require(path.join(__dirname, "..", "..", "dao", "video-dao.js"));

const videoDao = new VideoDao(path.join(__dirname, "..", "..", "storage", "videos.json"));


async function DeleteAbl(req, res) {
  try {
    let id = req.body.id;
    for (let video of req.body.videoList) {
      await videoDao.deleteTag(video.id, id);
    }
    return res.json({})
  } catch (e) {
    res.status(500).json({
      "error": e.message
    })
  }
}

module.exports = DeleteAbl;
