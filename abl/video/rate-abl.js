"use strict";

const path = require("path");
const Ajv = require("ajv").default;

const VideoDao = require(path.join(__dirname, "..", "..", "dao", "video-dao.js"));

const videoDao = new VideoDao(path.join(__dirname, "..", "..", "storage", "videos.json"));

// JSON schema
let schema = {
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "rating": {
      "type": "number",
      "minimum": 0,
      "maximum": 5
    }
  },
  "required": [
    "id",
    "rating"
  ]
};


async function RateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let video = await videoDao.getVideo(req.body.id);
      if (!video) {
      res.status(400).send({error: `Video with id '${req.body.id}' doesn't exist.`});
      } else {
        await videoDao.rateVideo(video.id, req.body.rating);
        video = await videoDao.getVideo(video.id);
        res.json(video);
      }
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: req.body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    res.status(500).json({
      "error": e.message
    })
  }
}

module.exports = RateAbl;