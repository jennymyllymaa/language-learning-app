const database = require("../database/repository");
const express = require("express");

const wordsRouter = express.Router();

wordsRouter.get("/", async (req, res) => {
  const words = await database.returnAllWords();
  res.json(words);
});

wordsRouter.post("/", async (req, res) => {
  const newWord = await database.saveWord(req.body);
  res.status(201).json(newWord);
});

wordsRouter.delete("/:myId([0-9]+)", async (req, res) => {
  const id = parseInt(req.params.myId);
  try {
    await database.deleteWordById(id);
    res.status(204).end();
  } catch {
    res.status(404).end();
  }
});

module.exports = wordsRouter;
