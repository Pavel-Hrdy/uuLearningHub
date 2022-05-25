"use strict";

const path = require("path");

const VideoDao = require(path.join(__dirname, "..", "..", "dao", "video-dao.js"));

const videoDao = new VideoDao(path.join(__dirname, "..", "..", "storage", "videos.json"));

async function GetAbl(req, res) {
  try {
    let id = req.params.id;
    const video = await videoDao.getVideo(id);
    if (!video) {
      return res.status(400).json({
        "error": `Video with id '${id}' doesn't exist.`
      });
    }
    return res.json(video);

  } catch (e) {
    return res.status(500).json({
      "error": e.message
    })
  }
}

module.exports = GetAbl;
