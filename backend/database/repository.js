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
            [newId, language],
            (error, results) => {
              if (error) {
                reject(error);
                return;
              }
              resolve({
                id: newId,
                name: language,
              });
            }
          );
        }
      );
    });
  },

  returnAll: () => {
    return new Promise((resolve, reject) => {
      const sentence = "SELECT * FROM translations";
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
