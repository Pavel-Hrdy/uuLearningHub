"use strict";

const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/link/create-abl");
const GetAbl = require("../abl/link/get-abl");
const ListAbl = require("../abl/link/list-abl");
const UpdateAbl = require("../abl/link/update-abl");




router.post("/create", async (req, res) => {
  await CreateAbl(req, res)
});

router.get("/", async (req, res) => {
  await ListAbl(req, res)
});

router.get("/:name", async (req, res) => {
  await GetAbl(req, res)
});

router.post("/update", async (req, res) => {
  await UpdateAbl(req, res)
});



module.exports = router;
