"use strict";

const path = require("path");
const Ajv = require("ajv").default;

const VideoDao = require(path.join(__dirname, "..", "..", "dao", "video-dao.js"));

const videoDao = new VideoDao(path.join(__dirname, "..", "..", "storage", "videos.json"));

let schema = {
  "type": "object",
  "properties": {
    "id": { "type": "string"}
  },
  "required": ["id"]
};

async function DeleteAbl(req, res) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);
  try {
    if (valid) {
      const id = req.body.id;
      await videoDao.deleteVideo(id);
      res.json({});
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

module.exports = DeleteAbl;
