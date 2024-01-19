import Grid from "@mui/material/Grid";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";

/**
 * React functional component for editing a test.
 * @component
 * @param {object} props Props passed to the component.
 * @param {object[]} props.words List of all words from the database.
 * @param {function} props.fetchTests Function to fetch all tests.
 * @param {string} props.fromLanguage The question language of the current test.
 * @param {string} props.toLanguage The asnwer language of the current test.
 * @param {function} props.setFromLanguage Function to set the question language.
 * @param {function} props.setToLanguage Function to set the answer language.
 * @return {JSX.Element} JSX element representing the test editing component.
 */
function EditTest(props) {
  /**
   * State that holds the question language.
   * @type {string}
   */
  const [questionLanguage, setQuestionLanguage] = useState("");

  /**
   * State that holds the answer language.
   * @type {string}
   */
  const [answerLanguage, setAnswerLanguage] = useState("");

  /**
   * State that holds array that holds all languages from backend.
   * @type {array}
   */
  const [availableLanguages, setAvailableLanguages] = useState([
    "English",
    "Finnish",
    "Swedish",
    "German",
    "Italian",
  ]);

  /**
   * State that holds array that holds all original languages.
   * @type {array}
   */
  const originalLanguages = [
    "English",
    "Finnish",
    "Swedish",
    "German",
    "Italian",
  ];

  /**
   * Event handler function that sets selected question language to state and
   * removes the language from answer language options.
   * @function
   * @param {object} event The event object.
   */
  const handleChangeFromLanguage = (event) => {
    setSelectedQuestionLanguage(event.target.value);

    const updatedLanguages = [...originalLanguages];

    for (let i = 0; i < updatedLanguages.length; i++) {
      if (updatedLanguages[i] === event.target.value) {
        updatedLanguages.splice(i, 1);
        break;
      }
    }
    setAvailableLanguages(updatedLanguages);
  };

  /**
   * Event handler function that sets the picked language to selectedAnswerLanguage
   * @function
   * @param {object} event The event object.
   */
  const handleChangeToLanguage = (event) => {
    setSelectedAnswerLanguage(event.target.value);
  };

  /**
   * State that keeps track if the languages are chosen
   * @type {boolean}
   */
  const [languagesChosen, setLanguagesChosen] = useState(false);

  /**
   * Function that sets datagrid to be shown and sets available words as availableWords and to rows
   * @function
   */
  const useLanguages = () => {
    setLanguagesChosen(true);
    checkAvailableWords();
  };

  /**
   * Columns for the datagrid
   * @type {array}
   */
  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 100,
    },
    { field: "fromWord", headerName: `${questionLanguage}`, width: 200 },
    { field: "toWord", headerName: `${answerLanguage}`, width: 200 },
    {
      field: "delete",
      headerName: "Delete",
      width: 120,
      editable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={(e) => onButtonClick(e, params.row)}
            variant="contained"
          >
            <DeleteIcon />
          </Button>
        );
      },
    },
  ];

  /**
   * Event handler function for each rows delete button
   * @function
   * @param {object} event The event object.
   * @param {object} row The row data
   */
  const onButtonClick = (e, row) => {
    e.stopPropagation();
    deleteRow(row);
  };

  /**
   * State that holds the available words pairs for selected languages
   * @type {array}
   */
  const [availableWords, setAvailableWords] = useState([]);

  /**
   * Function that deletes the row from availableWords
   * @function
   * @param {object} row The row data
   */
  const deleteRow = (row) => {
    let tempArr = availableWords;
    tempArr = tempArr.filter((wordPair) => wordPair.id !== row.id);
    setAvailableWords(tempArr);
  };

  /**
   * States that hold selected languages before used selects to use them
   * so the column names wont change before that
   * @type {string}
   */
  const [selectedQuestionLanguage, setSelectedQuestionLanguage] = useState("");
  const [selectedAnswerLanguage, setSelectedAnswerLanguage] = useState("");

  /**
   * Function that checks the used languages and goes through the words
   * checking which words have those languages filled and sets them into availableWords
   * @function
   */
  const checkAvailableWords = () => {
    setQuestionLanguage(selectedQuestionLanguage);
    setAnswerLanguage(selectedAnswerLanguage);

    const firstLanguage = selectedQuestionLanguage.toLowerCase();
    const secondLanguage = selectedAnswerLanguage.toLowerCase();

    let tempArr = [];
    for (let i = 0; i < props.words.length; i++) {
      const wordData = props.words[i];

      if (
        wordData[firstLanguage] !== null &&
        wordData[secondLanguage] !== null
      ) {
        const wordPair = {
          id: wordData.id,
          fromWord: wordData[firstLanguage],
          toWord: wordData[secondLanguage],
        };
        tempArr.push(wordPair);
      }
    }
    setAvailableWords(tempArr);
  };

  /**
   * Rows for the datagrid.
   * @type {array}
   */
  const rows = availableWords;

  /**
   * Function that updates the current_test row in backend.
   * Finally fetchTests to trigger rerender and update language states.
   * @function
   * @async
   */
  const updateCurrentTestToBackend = async () => {
    let row = {};
    row.id = 1;
    row.name = "current_test";
    row.from_language = questionLanguage.toLowerCase();
    row.to_language = answerLanguage.toLowerCase();

    //Backend words array is in different shape so updating that
    const wordsForBackend = availableWords.map((word) => ({
      from_word: word.fromWord,
      to_word: word.toWord,
    }));
    row.words = wordsForBackend;
    console.log("frontend: ", row);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/tests/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(row),
      });
      props.fetchTests();
    } catch (error) {
      console.error("Error saving word.");
    }
    props.setFromLanguage(questionLanguage);
    props.setToLanguage(answerLanguage);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography>Choose languages</Typography>

      <Stack direction="row">
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>From</InputLabel>
          <Select
            value={selectedQuestionLanguage}
            label="From"
            onChange={handleChangeFromLanguage}
          >
            <MenuItem value={"English"}>English</MenuItem>
            <MenuItem value={"Finnish"}>Finnish</MenuItem>
            <MenuItem value={"Swedish"}>Swedish</MenuItem>
            <MenuItem value={"German"}>German</MenuItem>
            <MenuItem value={"Italian"}>Italian</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>To</InputLabel>
          <Select
            value={selectedAnswerLanguage}
            label="To"
            onChange={handleChangeToLanguage}
          >
            {availableLanguages.map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Button onClick={useLanguages}>Use</Button>
      {languagesChosen && (
        <div style={{ textAlign: "center" }}>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </div>
          <Button onClick={updateCurrentTestToBackend}>
            Save as current test
          </Button>
        </div>
      )}
    </Grid>
  );
}

export default EditTest;
