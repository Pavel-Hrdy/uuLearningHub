"use strict";

const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/chapter/get-abl");
const ListAbl = require("../abl/chapter/list-abl");

// slouží k vylistování všech kapitol i s podkapitolami (prakticky nahraje celou DB kapitol)
router.get("/", async (req, res) => {
  await ListAbl(req,res)
});

// vrací kapitolu / subkapitolu podle zadaného id
router.get("/:id", async (req, res) => {
  await GetAbl(req, res)
});






module.exports = router;
