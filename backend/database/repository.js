const connection = require("./config.js");

/**
 * Goes through given word object and replaces "" and " " with null.
 * @param {object} word The word object.
 * @returns {object} Word object with "" and " " replaced with null.
 */
const checkEmptys = (word) => {
  const result = {};
  for (const key in word) {
    if(word[key] == "" || word[key] == " ") {
      result[key] = null;
    }
    else {
      result[key] = word[key];
    }
  }
  return result;
};

/**
 * Object that stores the functions for routers in tests.js and words.js
 * @type {object}
 */
const connectionFunctions = {
  /**
   * Connection fucntion for the MySQL connection
   * @returns {Promise} A promise that resolves when the connection is successful.
   */
  connect: () => {
    return new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  },

  /**
   * Closing fucntion for the MySQL connection
   * @returns {Promise} A promise that resolves when the connection is closes.
   */
  close: () => {
    return new Promise((resolve, reject) => {
      connection.end((err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },

  /**
   * Function for wordsRouter. Returns all the words from the database.
   * @returns {Promise} A promise that resolves with an array of word objects.
   */
  returnAllWords: () => {
    return new Promise((resolve, reject) => {
      const sentence = "SELECT * FROM words";
      connection.query(sentence, (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },

  /**
   * Function for wordsRouter. Returns all the words from the database.
   * The function first goes through the existing id numbers in the database to
   * get the smallest available one. This is to ensure that id numbers stay as small as possible.
   * @param {object} newWordInput The new word object.
   * @returns {Promise} A promise that resolves when the new word has been saved to the database.
   */
  saveWord: (newWordInput) => {
    const newWord = checkEmptys(newWordInput);
    return new Promise((resolve, reject) => {
      //Get id numbers for database
      connection.query(
        "SELECT id FROM words ORDER BY id ASC",
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }

          let newId = 1;
          for (const row of results) {
            if (newId < row.id) {
              break;
            }
            newId++;
          }

          connection.query(
            "INSERT INTO words (id, tag, english, finnish, swedish, german, italian) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              newId,
              newWord.tag,
              newWord.english,
              newWord.finnish,
              newWord.swedish,
              newWord.german,
              newWord.italian,
            ],
            (error, results) => {
              if (error) {
                reject(error);
                return;
              }
              resolve({
                id: newId,
                tag: newWord.tag,
                english: newWord.english,
                finnish: newWord.finnish,
                swedish: newWord.swedish,
                german: newWord.german,
                italian: newWord.italian,
              });
            }
          );
        }
      );
    });
  },

  /**
   * Function for wordsRouter. Deletes a word from the database.
   * @param {number} id The id number of the word to be deleted.
   * @returns {Promise} A promise that resolves when the word has been deleted from the database.
   */
  deleteWordById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM words WHERE id = ?",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve("Deleted word with id: " + id);
        }
      );
    });
  },

  /**
   * Function for wordsRouter. Updates a row in the database.
   * @param {object} newRowInput The new row object.
   * @returns {Promise} A promise that resolves when the row has been updated to the database.
   */
  updateWord: (newRowInput) => {
    const newRow = checkEmptys(newRowInput);
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE words SET tag = ?, english = ?, finnish = ?, swedish = ?, german = ?, italian = ? WHERE id = ?;",
        [
          newRow.tag,
          newRow.english,
          newRow.finnish,
          newRow.swedish,
          newRow.german,
          newRow.italian,
          newRow.id,
        ],
        (error, resuts) => {
          if (error) {
            reject(error);
          }
          resolve(newRow);
        }
      );
    });
  },

  /**
   * Function for testsRouter. Returns all the tests from the database.
   * Function is prepared to deal with multiple tests because it is also
   * made for future functionality where the user would be able to save
   * different tests into database, not just the current test.
   * @returns {Promise} A promise that resolves with an array of test objects from the database.
   */
  returnAllTests: () => {
    return new Promise((resolve, reject) => {
      const sentence = "SELECT * FROM tests";
      connection.query(sentence, (error, results) => {
        if (error) {
          reject(error);
        }
        const parsedResults = results.map((result) => ({
          ...result,
          words: JSON.parse(result.words),
        }));
        resolve(parsedResults);
      });
    });
  },

  /**
   * Function for testsRouter. Deletes a test from the database. Useful after multiple tests
   * have been enabled.
   * @param {number} id The id number of the test to be deleted.
   * @returns {Promise} A promise that resolves when the test has been deleted from the database.
   */
  deleteTestById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM tests WHERE id = ?",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve("Deleted test with id: " + id);
        }
      );
    });
  },

  /**
   * Function for testsRouter. Updates an existing test in database.
   * @param {object} newTestInput The new row of data for the test.
   * @returns {Promise} A promise that resolves when the test has been updated in database.
   */
  saveTestChanges: (newTestInput) => {
    const newTest = checkEmptys(newTestInput);
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE tests SET name = ?, from_language = ?, to_language = ?, words = ? WHERE id = ?",
        [
          newTest.name,
          newTest.from_language,
          newTest.to_language,
          JSON.stringify(newTest.words),
          newTest.id,
        ],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          resolve({
            id: newTest.id,
            name: newTest.name,
            from_language: newTest.from_language,
            to_language: newTest.to_language,
            words: newTest.words,
          });
        }
      );
    });
  },

  /**
   * Function for testsRouter. Saves new test to database. Will be needed when multiple tests are enabled.
   * The function first goes through the existing id numbers in the database to
   * get the smallest available one. This is to ensure that id numbers stay as small as possible.
   * @param {object} newTestInput The new test object.
   * @returns {Promise} A promise that resolves when the new test has been saved to database.
   */
  saveNewTest: (newTestInput) => {
    const newTest = checkEmptys(newTestInput);
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT id FROM tests ORDER BY id ASC",
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }

          let newId = 1;
          for (const row of results) {
            if (newId < row.id) {
              break;
            }
            newId++;
          }

          connection.query(
            "INSERT INTO tests (id, name, from_language, to_language, words) VALUES (?, ?, ?, ?, ?)",
            [
              newId,
              newTest.name,
              newTest.from_language,
              newTest.to_language,
              JSON.stringify(newTest.words),
            ],
            (error, results) => {
              if (error) {
                reject(error);
                return;
              }
              resolve({
                id: newId,
                name: newTest.name,
                from_language: newTest.from_language,
                to_language: newTest.to_language,
                words: newTest.words,
              });
            }
          );
        }
      );
    });
  },
};

module.exports = connectionFunctions;
