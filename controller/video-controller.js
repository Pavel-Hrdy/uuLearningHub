"use strict";

const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/video/create-abl");
const GetAbl = require("../abl/video/get-abl");
const ListAbl = require("../abl/video/list-abl");
const UpdateAbl = require("../abl/video/update-abl");
const RateAbl = require("../abl/video/rate-abl");
const DeleteAbl = require("../abl/video/delete-abl");




router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

router.get("/:id", async (req, res) => {
  await GetAbl(req, res);
});

router.get("/", async (req, res) => {
  await ListAbl(req, res);
});

router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

router.post("/rate", async(req, res) => {
  await RateAbl(req, res);
})

router.post("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});


module.exports = router;
