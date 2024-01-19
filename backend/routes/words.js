const database = require("../database/repository");
const express = require("express");

/**
 * Express router for words.
 * @type {object}
 */
const wordsRouter = express.Router();

/**
 * Route to retrieve all words from database.
 * @name GET/words
 * @function
 * @async
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<void>} A Promise representing the completion of the request.
 */
wordsRouter.get("/", async (req, res) => {
  const words = await database.returnAllWords();
  res.json(words);
});

/**
 * Route to post a new word to database.
 * @name POST/words
 * @function
 * @async
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<void>} A Promise representing the completion of the request.
 */
wordsRouter.post("/", async (req, res) => {
  const newWord = await database.saveWord(req.body);
  res.status(201).json(newWord);
});

/**
 * Route to delete a word from the database.
 * Id of the word is gotten as a part of the url.
 * @name DELETE/words
 * @function
 * @async
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<void>} A Promise representing the completion of the request.
 */
wordsRouter.delete("/:myId([0-9]+)", async (req, res) => {
  const id = parseInt(req.params.myId);
  try {
    await database.deleteWordById(id);
    res.status(204).end();
  } catch {
    res.status(404).end();
  }
});

/**
 * Route to update a word in the database.
 * @name PUT/words
 * @function
 * @async
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<void>} A Promise representing the completion of the request.
 */
wordsRouter.put("/", async (req, res) => {
  try {
    const updatedWord = await database.updateWord(req.body);
    res.json(updatedWord);
  } catch {
    res.status(404).end();
  }
});

module.exports = wordsRouter;
