"use strict";

const path = require("path");
const Ajv = require("ajv").default;

const TagDao = require(path.join(__dirname, "..", "..", "dao", "tag-dao.js"));

const tagDao = new TagDao(path.join(__dirname, "..", "..", "storage", "tags.json"));

// JSON schema
const schema = {
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "id": {
        "type": "string"
    },
  },
  "additionalProperties": false,
  "required": [
    "name",
    "id"
  ],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let tag = await tagDao.updateTag(req.body);
      res.json(tag);
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

module.exports = UpdateAbl;