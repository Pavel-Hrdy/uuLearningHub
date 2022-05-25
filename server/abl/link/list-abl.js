"use strict";

const path = require("path");

const LinkDao = require(path.join(__dirname, "..", "..", "dao", "link-dao.js"));

const linkDao = new LinkDao(path.join(__dirname, "..", "..", "storage", "links.json"));


async function ListAbl(req, res) {
  try {
    let videos = await linkDao.listLinks();
    return res.json(videos);
    
  } catch (e) {
    return  res.status(500).json({
      "error": e.message
    })
  }
}

module.exports = ListAbl;
