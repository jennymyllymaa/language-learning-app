const database = require("../database/repository");
const express = require("express");

/**
 * Express router for tests.
 * @type {object}
 */
const testsRouter = express.Router();

/**
 * Route to retrieve all tests from database.
 * @name GET/tests
 * @function
 * @async
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<void>} A Promise representing the completion of the request.
 */
  testsRouter.get("/", async (req, res) => {
  const tests = await database.returnAllTests();
  res.json(tests);
});

/**
 * Route to post new test.
 * @name POST/tests
 * @function
 * @async
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<void>} A Promise representing the completion of the request.
 */
testsRouter.post("/", async (req, res) => {
  const newTest = await database.saveNewTest(req.body);
  res.status(201).json(newTest);
});

/**
 * Route to delete a test.
 * Id of the word is gotten as a part of the url.
 * @name DELETE/tests
 * @function
 * @async
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<void>} A Promise representing the completion of the request.
 */
testsRouter.delete("/:myId([0-9]+)", async (req, res) => {
  const id = parseInt(req.params.myId);
  try {
    const response = await database.deleteTestById(id);
    res.json(response);
  } catch {
    res.status(404).end();
  }
});

/**
 * Route to delete a test.
 * @name PUT/tests
 * @function
 * @async
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<void>} A Promise representing the completion of the request.
 */
testsRouter.put("/", async (req, res) => {
  try {
    const updatedRow = await database.saveTestChanges(req.body);
    res.json(updatedRow);
  } catch {
    res.status(404).end();
  }
});

module.exports = testsRouter;
