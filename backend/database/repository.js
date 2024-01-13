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

  deleteLanguageById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM languages WHERE id = ?", [id], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve("Deleted language with id: " + id);
        }
      );
    });
  },

  saveLanguage: (language) => {
    return new Promise((resolve, reject) => {
      //Get id numbers for database
      connection.query(
        "SELECT id FROM languages ORDER BY id ASC",
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
            "INSERT INTO languages (id, name) VALUES (?, ?)",
            [newId, language.name],
            (error, results) => {
              if (error) {
                reject(error);
                return;
              }
              resolve({
                id: newId,
                name: language.name,
              });
            }
          );
        }
      );
    });
  },

  returnAllLanguages: () => {
    return new Promise((resolve, reject) => {
      const sentence = "SELECT * FROM languages";
      connection.query(sentence, (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },
};

module.exports = connectionFunctions;
