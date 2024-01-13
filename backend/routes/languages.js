const database = require("../database/repository");
const express = require("express");

const languagesRouter = express.Router();

languagesRouter.get("/", async (req, res) => {
  const languages = await database.returnAllLanguages();
  res.json(languages);
});

languagesRouter.post("/", async (req, res) => {
  console.log(req.body);
  const newLanguage = await database.saveLanguage(req.body);
  res.status(201).json(newLanguage);
});

languagesRouter.delete("/:myId([0-9]+)", async(req, res) => {
  const id = parseInt(req.params.myId);
  console.log(id);
  try {
    await database.deleteLanguageById(id);
    res.status(204).end();
  } catch {
    res.status(404).end();
  }
});

module.exports = languagesRouter;
