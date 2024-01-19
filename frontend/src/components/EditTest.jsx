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

function EditTest(props) {
  //States that hold selected lnaguages before saving
  const [questionLanguage, setQuestionLanguage] = useState("");
  const [answerLanguage, setAnswerLanguage] = useState("");

  //Array that hold all languages from backend
  const [availableLanguages, setAvailableLanguages] = useState([
    "English",
    "Finnish",
    "Swedish",
    "German",
    "Italian",
  ]);
  const originalLanguages = [
    "English",
    "Finnish",
    "Swedish",
    "German",
    "Italian",
  ];

  //Function that sets selected question language to state and removes the language from answer language options
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

  // Set answer language
  const handleChangeToLanguage = (event) => {
    setSelectedAnswerLanguage(event.target.value);
  };

  //State that keeps track if the languages are chosen
  const [languagesChosen, setLanguagesChosen] = useState(false);

  //Function that sets datagrid to be shown and sets available words as availableWords and to rows
  const useLanguages = () => {
    setLanguagesChosen(true);
    checkAvailableWords();
  };

  //Columns for the datagrid
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

  //Function for each rows delete button
  const onButtonClick = (e, row) => {
    e.stopPropagation();
    deleteRow(row);
  };

  //State that holds the available words pairs for selected languages as {question, answer}
  const [availableWords, setAvailableWords] = useState([]);

  //Function that deletes the row from availableWords
  const deleteRow = (row) => {
    let tempArr = availableWords;
    tempArr = tempArr.filter((wordPair) => wordPair.id !== row.id);
    setAvailableWords(tempArr);
  };

  //States that hold selected languages before used selects to use them
  // so the column names wont change before that
  const [selectedQuestionLanguage, setSelectedQuestionLanguage] = useState("");
  const [selectedAnswerLanguage, setSelectedAnswerLanguage] = useState("");

  //Function that check the used languages and goes through the words
  // checking which words have those languages filled and sets them into availableWords
  const checkAvailableWords = () => {
    //Set selected languages to actual languages for the datagrid table
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

  //Rows for the datagrid
  const rows = availableWords;

  //Function that updates the current_test row in backend
  const updateCurrentTestToBackend = async () => {
    let row = {};
    row.id = 1;
    row.name = "current_test"
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
      //Update tests state
      props.fetchTests();
    } catch (error) {
      console.error("Error saving word.");
    }
    //Also update language states
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
