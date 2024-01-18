const database = require("../database/repository");
const express = require("express");

const testsRouter = express.Router();

testsRouter.get("/", async (req, res) => {
  const tests = await database.returnAllTestNames();
  res.json(tests);
});

testsRouter.get("/:myId([0-9]+)", async (req, res) => {
  const id = parseInt(req.params.myId);
  try {
    const wordPairs = await database.returnTestWords(id);
    res.json(wordPairs);
  } catch {
    res.status(404).end();
  }
});

testsRouter.post("/", async (req, res) => {
  const newTest = await database.saveTest(req.body);
  res.status(201).json(newTest);
});

testsRouter.delete("/:myId([0-9]+)", async (req, res) => {
  const id = parseInt(req.params.myId);
  try {
    await database.deleteTestById(id);
    res.status(204).end();
  } catch {
    res.status(404).end();
  }
});

module.exports = testsRouter;
