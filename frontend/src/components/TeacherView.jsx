import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useState } from 'react';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function TeacherView(props) {
  //State that holdds the available words pairs for selected languages as {question, answer}
  const [availableWords, setAvailableWords] = useState([]);
  //Array that hold all languages from backend
  const [availableLanguages, setAvailableLanguages] = useState(["English", "Finnish", "Swedish"]);
  const originalLanguages = ["English", "Finnish", "Swedish"];

  //Function that sets selected question language to state and removes the language from answer language options
  const handleChangeFromLanguage = (event) => {
    props.setFromLanguage(event.target.value);

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
    props.setToLanguage(event.target.value);
  };

  //Function that uses languages to fetch available wordpairs from backend and set those to availableWords

  return (
    <div>
      <Box>
        <button>Choose languages</button>

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
          <InputLabel>From</InputLabel>
          <Select
            value={props.toLanguage}
            label="From"
            onChange={handleChangeToLanguage}
          >
            {availableLanguages.map((language) => (<MenuItem key={language} value={language}>{language}</MenuItem>))}
          </Select>
        </FormControl>

        <button>Choose words</button>
        <ul>{props.practiseWords}</ul>
        <button>Save</button>
      </Box>
    </div>
  );
}

export default TeacherView;
