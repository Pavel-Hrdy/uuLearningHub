"use strict";

const path = require("path");

const TagDao = require(path.join(__dirname, "..", "..", "dao", "tag-dao.js"));

const tagDao = new TagDao(path.join(__dirname, "..", "..", "storage", "tags.json"));

async function GetAbl(req, res) {
  try {
    let id = req.params.id;
    const tag = await tagDao.getTag(id);
    if (!tag) {
      return res.status(400).json({
        "error": `Tag with id '${id}' doesn't exist.`
      });
    }
    return res.json(tag);

  } catch (e) {
    return res.status(500).json({
      "error": e.message
    })
  }
}

module.exports = GetAbl;
