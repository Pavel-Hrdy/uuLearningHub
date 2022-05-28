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

    "links": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    },
    "state": {
      "type": "string",
      "enum": ["active", "passive", null]
    }
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
      // nahrání schématu videa z request.body
      let videoSchema = req.body;
      // adding creationDate attribute to the video object
      videoSchema.creationDate = new Date().toISOString();
      // generatig unique ID to the video object using YouTube hash
      // RegEx to validate the link & extract the hash (group 4)
      const youtubePattern = /(https:\/\/)(www\.)(youtube\.com\/watch\?v=|youtu.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]+)(\?(.*)?|&(.*)?)?/;
      let matchArr = videoSchema.link.match(youtubePattern);

      // validates the link
      if (!matchArr) {
        return res.status(400).json({
          "error": "The link is not valid!"
        })
      } else {
        videoSchema.id = matchArr[4];
        // creating embedded link
        videoSchema.link = `https://www.youtube.com/embed/${videoSchema.id}`
      }

      // validates if the chapter-subchapter exists
      let subchapterSchema = await chapterDao.getSubchapter(videoSchema.chapterSchema)
      let chapterSchema = await chapterDao.getChapter(videoSchema.chapterSchema)
      if (subchapterSchema) {
        videoSchema.chapterSchema.chapterOrderNumber = chapterSchema.chapterOrderNumber;
        videoSchema.chapterSchema.subchapterOrderNumber = subchapterSchema.subchapterOrderNumber;
      } else {
        return res.status(400).json({
          "error": "Chapter doesn't exist!"
        })
      }

      // validates the tags
      videoSchema.tags = videoSchema.tags ? videoSchema.tags : [];
      for (let tag of videoSchema.tags) {
        if (! await tagDao.getTag(tag)) {
          return res.status(400).json({
            "error": "Tags are invalid!"
          });
        }
      }

      // validates the links
      videoSchema.links = videoSchema.links ? videoSchema.links : [];
      for (let link of videoSchema.links) {
        if (!await linkDao.getLink(link)) {
          return res.status(400).json({
            "error": "Links are invalid!"
          });
        }
      }

      // status is set to default value - "active"
      if (!videoSchema.state) {
        videoSchema.state = "active";
      }

      // setting video rating to zero and number of ratings to zero
      videoSchema.rating = 0;
      videoSchema.numberOfRatings = 0;

      // adding video to the DB if everything is fine
      let video = await videoDao.createVideo(videoSchema);
      return res.json(video);

    // JSON Schema validation failed
    } else {
      return res.status(400).json({
        "errorMessage": "Validation of input failed.",
        "params": req.body,
        "reason": ajv.errors
      })
    }

  //server Error
  } catch (e) {
    return res.status(500).json({
      "error": e.message,
    })
  }
}

module.exports = CreateAbl;