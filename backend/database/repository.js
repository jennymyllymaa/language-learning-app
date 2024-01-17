const connection = require("./config.js");

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

  saveWord: (newWord) => {
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
              newWord.englishWord,
              newWord.finnishWord,
              newWord.swedishWord,
              newWord.germanWord,
              newWord.italianWord,
            ],
            (error, results) => {
              if (error) {
                reject(error);
                return;
              }
              resolve({
                id: newId,
                tag: newWord.tag,
                english: newWord.englishWord,
                finnish: newWord.finnishWord,
                swedish: newWord.swedishWord,
                german: newWord.germanWord,
                italian: newWord.italianWord,
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
};

module.exports = connectionFunctions;
