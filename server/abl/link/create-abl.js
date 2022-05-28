"use strict";

const path = require("path");
const Ajv = require("ajv").default;

const LinkDao = require(path.join(__dirname, "..", "..", "dao", "link-dao.js"));

const linkDao = new LinkDao(path.join(__dirname, "..", "..", "storage", "links.json"));

// JSON schema
const schema = {
  "type": "object",
  "properties": {
    "link": {
      "type": "string"
    },
    "name": {
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "link"
  ],
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let linkToValidate = req.body.link;
      if (!linkToValidate.startsWith("https://developer.mozilla.org")) {
        return res.status(400).json({
          "error": "The link is not valid!"
        })
      };
      let name;
      if (!req.body.name) {
        name = req.body.link.split("/");
        name = name[name.length - 1].toLowerCase();
      } else {
        name = req.body.name;
      }
      name = name.toLowerCase().split(" ").join("_");
      req.body.name = name;
      let link = await linkDao.createLink(req.body);
      return res.json(link);
    } else {
      return res.status(400).json({
        errorMessage: "Validation of input failed.",
        params: req.body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    return res.status(500).json({
      "error": e.message,
    })
  }
}

module.exports = CreateAbl;