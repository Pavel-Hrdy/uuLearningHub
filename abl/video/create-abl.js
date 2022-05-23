"use strict";

const path = require("path");
const Ajv = require("ajv").default;

const VideoDao = require(path.join(__dirname, "..", "..", "dao", "video-dao.js"));
const ChapterDao = require(path.join(__dirname, "..", "..", "dao", "chapter-dao.js"));
const TagDao = require(path.join(__dirname, "..", "..", "dao", "tag-dao.js"));


const videoDao = new VideoDao(path.join(__dirname, "..", "..", "storage", "videos.json"));
const chapterDao = new ChapterDao(path.join(__dirname, "..", "..", "storage", "chapters.json"));
const tagDao = new TagDao(path.join(__dirname, "..", "..", "storage", "tags.json"));

// JSON schema
const schema = {
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "link": {    
      "type": "string"},
    "chapterSchema": {
      "type": "object",
      "properties": {
        "chapterOrderNumber": {
          "type": "string"
        },
        "subchapterOrderNumber": {
          "type": "string"
        }
      },
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    },
    /* TODO LINKS
    "links": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    },

    */
    "state": {
      "type": "string"}
  },
  "required": [
    "name",
    "link",
    "chapterSchema",
    "state"
  ],
  "additionalProperties": false
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let videoSchema = req.body;
      // adding creationDate attribute to the video object
      videoSchema.creationDate = new Date().toISOString();
      // generatig unique ID to the video object using YouTube hash
      // RegEx to validate the link & extract the hash (group 3)
      const youtubePattern = /(https:\/\/)(www\.)(youtube\.com\/watch\?v=|youtu.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]+)(\?(.*)?|&(.*)?)?/;
      let matchArr = videoSchema.link.match(youtubePattern);
      // alternative scenario, where the link doesn't match the RegEx
      if (!matchArr) {
        res.status(400).send({
          "error": "The link is not valid!"
        })
      }
      videoSchema.id = matchArr[4];
      videoSchema.link = `https://www.youtube.com/embed/${videoSchema.id}`
      // validates if the chapter-subchapter exists
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
      videoSchema.tags = videoSchema.tags ? videoSchema.tags : [];
      for (let tag of videoSchema.tags) {
        if (! await tagDao.getTag(tag)) {
          res.status(400).send("Tags are invalid!");
        }
      }
      // TODO links validation
      videoSchema.links = videoSchema.links ? videoSchema.links : [];
      // setting video rating to zero and number of ratings to zero
      videoSchema.rating = 0;
      videoSchema.numberOfRatings = 0;
      // adding video to the DB
      let video = await videoDao.createVideo(videoSchema);
      res.json(video);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: req.body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    res.status(500).json({
      "error": e.message,
    })
  }
}

module.exports = CreateAbl;