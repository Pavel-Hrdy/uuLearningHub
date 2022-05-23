"use strict";

const path = require("path");
const Ajv = require("ajv").default;

const VideoDao = require(path.join(__dirname, "..", "..", "dao", "video-dao.js"));
const ChapterDao = require(path.join(__dirname, "..", "..", "dao", "chapter-dao.js"));
const TagDao = require(path.join(__dirname, "..", "..", "dao", "tag-dao.js"));
const LinkDao = require(path.join(__dirname, "..", "..", "dao", "link-dao.js"));


const videoDao = new VideoDao(path.join(__dirname, "..", "..", "storage", "videos.json"));
const chapterDao = new ChapterDao(path.join(__dirname, "..", "..", "storage", "chapters.json"));
const tagDao = new TagDao(path.join(__dirname, "..", "..", "storage", "tags.json"));
const linkDao = new LinkDao(path.join(__dirname, "..", "..", "storage", "links.json"));

// link CAN'T be editted - it would also edit the video ID
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
    "links": {
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
      // pomocná proměnná kontrolující, zda jsou všechny updatované paramtery v pořádku
      let okForUpdate = true;
      // nahrání schématu videa z request.body
      let videoSchema = req.body;

      // first, chapterSchema is checked
      if (videoSchema.chapterSchema) {
        let subchapterSchema = await chapterDao.getSubchapter(videoSchema.chapterSchema)
        let chapterSchema = await chapterDao.getChapter(videoSchema.chapterSchema)
        if (subchapterSchema) {
          videoSchema.chapterSchema.chapterOrderNumber = chapterSchema.chapterOrderNumber;
          videoSchema.chapterSchema.subchapterOrderNumber = subchapterSchema.subchapterOrderNumber;
        } else {
          okForUpdate = false;
          res.status(400).send({
          "error": "Chapter doesn't exist!"
          })
        }
      }

      // all tags are checked
      videoSchema.tags = videoSchema.tags ? videoSchema.tags : [];
      for (let tag of videoSchema.tags) {
        if (!await tagDao.getTag(tag)) {
          okForUpdate = false;
          res.status(400).send("Tags are invalid!");
        }
      }
      
      // all links are checked
      videoSchema.links = videoSchema.links ? videoSchema.links : [];
      for (let link of videoSchema.links) {
        if (!await linkDao.getLink(link)) {
          okForUpdate = false;
          res.status(400).send("Links are invalid!");
        }
      }

      // status is checked
      if (videoSchema.state) {
        if (videoSchema.state !== "active" && videoSchema.state !== "passive") {
          okForUpdate = false;
          res.status(400).send("Status is invalid!");
        }
      } 

      // adding video to the DB if everything was fine (There is no way to validate name and description)
      let video;
      if (okForUpdate) {
        video = await videoDao.updateVideo(videoSchema);
      }
      res.json(video);

    // case: JSON Schema doesn't match
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: req.body,
        reason: ajv.errors
      })
    }

  // case Server error
  } catch (e) {
    res.status(500).send({
      "error": e.message
    })
  }
}

module.exports = UpdateAbl;