"use strict";

const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/tag/create-abl");
const GetAbl = require("../abl/tag/get-abl");
const ListAbl = require("../abl/tag/list-abl");
const UpdateAbl = require("../abl/tag/update-abl");
const ListVideosAbl = require("../abl/tag/list-videos-abl");
const DeleteAbl = require("../abl/tag/delete-abl");




router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

router.get("/:id", async (req, res) => {
  await GetAbl(req, res);
});

router.post("/list", async (req, res) => {
  await ListAbl(req, res);
});

router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

router.post("/listVideos", async (req, res) => {
  await ListVideosAbl(req, res);
});

router.post("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});




module.exports = router;
