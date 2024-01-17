import Grid from "@mui/material/Grid";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";

function EditTest(props) {
  //State that holdds the available words pairs for selected languages as {question, answer}
  const [availableWords, setAvailableWords] = useState([]);
  //Array that hold all languages from backend
  const [availableLanguages, setAvailableLanguages] = useState([
    "English",
    "Finnish",
    "Swedish",
  ]);
  const originalLanguages = ["English", "Finnish", "Swedish"];

  //Function that sets selected question language to state and removes the language from answer language options
  const handleChangeFromLanguage = (event) => {
    props.changeFromLanguage(event.target.value); //

    const updatedLanguages = [...originalLanguages];

    for (let i = 0; i < updatedLanguages.length; i++) {
      if (updatedLanguages[i] === event.target.value) {
        updatedLanguages.splice(i, 1);
        break;
      }
    }
    setAvailableLanguages(updatedLanguages);
  };

  const handleChangeToLanguage = (event) => {
    props.changeToLanguage(event.target.value); //
  };

  //Function that uses languages to fetch available wordpairs from backend and set those to availableWords


  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography>Choose languages</Typography>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>From</InputLabel>
        <Select
          value={props.fromLanguage}
          label="From"
          onChange={handleChangeFromLanguage}
        >
          <MenuItem value={"English"}>English</MenuItem>
          <MenuItem value={"Finnish"}>Finnish</MenuItem>
          <MenuItem value={"Swedish"}>Swedish</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>To</InputLabel>
        <Select
          value={props.toLanguage}
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
      <button>Save</button>
    </Grid>
  );
}

export default EditTest;
