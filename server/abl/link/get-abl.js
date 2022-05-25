"use strict";

const path = require("path");

const LinkDao = require(path.join(__dirname, "..", "..", "dao", "link-dao.js"));

const linkDao = new LinkDao(path.join(__dirname, "..", "..", "storage", "links.json"));



async function GetAbl(req, res) {
  try {
    let name = req.params.name;
    const link = await linkDao.getLink(name);
    if (!link) {
      return res.status(400).json({
        "error": `Link with name '${name}' doesn't exist.`
      });
    }
    return res.json(link);

  } catch (e) {
    return res.status(500).json({
      "error": e.message
    })
  }
}

module.exports = GetAbl;
