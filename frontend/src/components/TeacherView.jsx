import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from 'react';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CurrentTest from "./CurrentTest";
import EditTest from "./EditTest";
import WordList from "./WordList";

function TeacherView(props) {
  const [showing, setShowing] = useState("currentTest");

  //Function that sets selected question language to state and removes the language from answer language options
  const changeFromLanguage = (language) => {
    props.setFromLanguage(language);
  };

  const changeToLanguage = (language) => {
    props.setToLanguage(language);
  };

  //Function that uses languages to fetch available wordpairs from backend and set those to availableWords

  const propsToEditTest = {
    changeFromLanguage,
    changeToLanguage,
    words: props.words,
  };

  const propsToWordList = {
    words: props.words,
    fetchWords: props.fetchWords,
  };

  return (
    <div>
      <AppBar>
        <Toolbar>
          <Typography variant="h4">Learn Languages</Typography>
          <Stack
            direction="row"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ marginLeft: "30px" }}
          >
            <Button
              variant="text"
              color="info"
              style={{ color: "white" }}
              onClick={() => {
                setShowing("currentTest");
              }}
            >
              Test
            </Button>
            <Button
              variant="text"
              color="info"
              style={{ color: "white" }}
              onClick={() => {
                setShowing("editTest");
              }}
            >
              Edit test
            </Button>
            <Button
              variant="text"
              color="info"
              style={{ color: "white" }}
              onClick={() => {
                setShowing("wordList");
              }}
            >
              Word list
            </Button>
          </Stack>

          <Stack direction="row" sx={{ marginLeft: "auto" }} spacing={2}>
            <Button variant="contained" color="info">
              Student
            </Button>
            <Button variant="contained" color="info">
              Log out
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box sx={{ marginTop: "20px" }}>
        {showing == "currentTest" && <CurrentTest />}
        {showing == "editTest" && <EditTest {...propsToEditTest} />}
        {showing == "wordList" && <WordList {...propsToWordList} />}
        {/* <Typography>Choose languages</Typography>

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

        <button>Choose words</button>
        <ul>{props.practiseWords}</ul>
        <button>Save</button> */}
      </Box>
    </div>
  );
}

export default TeacherView;
