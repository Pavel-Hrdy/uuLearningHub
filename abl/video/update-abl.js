"use strict";

const path = require("path");
const Ajv = require("ajv").default;

const VideoDao = require(path.join(__dirname, "..", "..", "dao", "video-dao.js"));
const ChapterDao = require(path.join(__dirname, "..", "..", "dao", "chapter-dao.js"));
const TagDao = require(path.join(__dirname, "..", "..", "dao", "tag-dao.js"));


const videoDao = new VideoDao(path.join(__dirname, "..", "..", "storage", "videos.json"));
const chapterDao = new ChapterDao(path.join(__dirname, "..", "..", "storage", "chapters.json"));
const tagDao = new TagDao(path.join(__dirname, "..", "..", "storage", "tags.json"));


const schema = {
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "link": {
      "type": "string"
    },
    "chapterSchema": {
      "type": "object",
      "properties": {
        "chapterOrderNumber": {
          "type": "string"
        },
        "subchapterOrderNumber": {
          "type": "string"
        }
      }
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    },
    "state": {
      "type": "string"}
  },
  "required": [
    "id"
  ],
  "additionalProperties": false
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let videoSchema = req.body;
      if (videoSchema.chapterSchema) {
        let subchapterSchema = await chapterDao.getSubchapter(videoSchema.chapterSchema)
        let chapterSchema = await chapterDao.getChapter(videoSchema.chapterSchema)
        if (subchapterSchema) {
          videoSchema.chapterSchema.chapterOrderNumber = chapterSchema.chapterOrderNumber;
          videoSchema.chapterSchema.subchapterOrderNumber = subchapterSchema.subchapterOrderNumber;
        } else {
          res.status(400).send({
          "error": "Chapter doesn't exist!"
        })
      }
      }
      videoSchema.tags = videoSchema.tags ? videoSchema.tags : [];
      for (let tag of videoSchema.tags) {
        if (! await tagDao.getTag(tag)) {
          res.status(400).send("Tags are invalid!");
        }
      }
      // adding video to the DB
      let video = await videoDao.updateVideo(videoSchema);
      res.json(video);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: req.body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    res.status(500).send({
      "error": e.message
    })
  }
}

module.exports = UpdateAbl;