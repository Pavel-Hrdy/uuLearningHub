"use strict";

const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/tag/create-abl");
const GetAbl = require("../abl/tag/get-abl");
const ListAbl = require("../abl/tag/list-abl");
const UpdateAbl = require("../abl/tag/update-abl");




router.post("/create", async (req, res) => {
  await CreateAbl(req, res)
});

router.get("/:id", async (req, res) => {
  await GetAbl(req, res)
});

router.post("/list", async (req, res) => {
  await ListAbl(req, res)
});

router.post("/update", async (req, res) => {
  await UpdateAbl(req, res)
});



module.exports = router;
