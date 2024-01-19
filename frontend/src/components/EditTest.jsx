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

  //State that holdds the available words pairs for selected languages as {question, answer}
  const [availableWords, setAvailableWords] = useState([]);

  //Array that hold all languages from backend
  const [availableLanguages, setAvailableLanguages] = useState([
    "English",
    "Finnish",
    "Swedish",
    "German",
    "Italian"
  ]);
  const originalLanguages = ["English", "Finnish", "Swedish", "German", "Italian"];

  //Function that sets selected question language to state and removes the language from answer language options
  const handleChangeFromLanguage = (event) => {
    setQuestionLanguage(event.target.value); //

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
    setAnswerLanguage(event.target.value);
  };

  //State that keeps track if the languages are chosen
  const [languagesChosen, setLanguagesChosen] = useState(false);

  //Function that
  const useLanguages = () => {
    console.log(questionLanguage);
    console.log(answerLanguage);
    setLanguagesChosen(true);
  }

  //Columns for the availableWords
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
      console.log(row);
    };

  //Rows for the datagrid
  const rows = [];

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
            value={questionLanguage}
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
            value={answerLanguage}
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
        <div>
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
      </div>
      )}
    </Grid>
  );
}

export default EditTest;
