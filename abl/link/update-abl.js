"use strict";

const path = require("path");
const Ajv = require("ajv").default;

const LinkDao = require(path.join(__dirname, "..", "..", "dao", "link-dao.js"));

const linkDao = new LinkDao(path.join(__dirname, "..", "..", "storage", "links.json"));

// JSON schema
const schema = {
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "link": {
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "name",
    "link"
  ],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let link = await linkDao.updateLink(req.body);
      res.json(link);
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