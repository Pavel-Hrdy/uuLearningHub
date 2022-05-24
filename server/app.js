"use strict";
//načtení modulu express
const express = require("express");
//načtení routerů
const videoRouter = require("./controller/video-controller");
const tagRouter = require("./controller/tag-controller");
const chapterRouter = require("./controller/chapter-controller");
const linkRouter = require("./controller/link-controller");


//inicializace nového Express.js serveru
const app = express();
//definování portu, na kterém má aplikace běžet na localhostu
const port = 3000;

// Parsování body
app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

//jednoduchá definice routy s HTTP metodou GET, která pouze navrací text
app.get("/", (req, res) => {
  res.send("uuLearningHub");
});

// nastavení routy pro správu videí
app.use("/video", videoRouter);

app.use("/chapter", chapterRouter);

app.use("/tag", tagRouter);

app.use("/link", linkRouter);

//nastavení portu, na kterém má běžet HTTP server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});