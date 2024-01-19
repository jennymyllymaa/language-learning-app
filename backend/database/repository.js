const connection = require("./config.js");

// Function to go through the word received from frontend and replace "" and " " with null
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

const connectionFunctions = {
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

  // Functions for wordsRouter
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

          //Assign first free id as the newId
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

  //Functions for testsRouter
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
        //resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },

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

  saveTest: (newTestInput) => {
    const newTest = checkEmptys(newTestInput);
    return new Promise((resolve, reject) => {
      //Get id numbers for database
      connection.query(
        "SELECT id FROM tests ORDER BY id ASC",
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }

          //Assign first free id as the newId
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

  updateCurrentTestRow: (newRow) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE tests SET words = ? WHERE id = ?;",
        [
          JSON.stringify(newRow.words),
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
  }
};

module.exports = connectionFunctions;
