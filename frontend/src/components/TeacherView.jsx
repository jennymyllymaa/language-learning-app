import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CurrentTest from "./CurrentTest";
import EditTest from "./EditTest";
import WordList from "./WordList";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function TeacherView(props) {
  const navigate = useNavigate();
  //State that keeps track which component is on display
  const [showing, setShowing] = useState("currentTest");

  //Function that sets selected question language to state and removes the language from answer language options
  const changeFromLanguage = (language) => {
    props.setFromLanguage(language);
  };

  //Function that changes answer language
  const changeToLanguage = (language) => {
    props.setToLanguage(language);
  };

  //Needed props for different components
  const propsToEditTest = {
    changeFromLanguage,
    changeToLanguage,
    words: props.words,
  };

  const propsToWordList = {
    words: props.words,
    fetchWords: props.fetchWords,
  };

  const propsToCurrentTest = {
    fromLanguage: props.fromLanguage,
    toLanguage: props.toLanguage,
    words: props.words,
    fetchTests: props.fetchTests,
    currentTest: props.currentTest,
    setCurrentTest: props.setCurrentTest,
    currentTestWords: props.currentTestWords,
  };

  return (
    <div>
      <AppBar position="static">
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
              Create new test
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
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                navigate("/");
              }}
            >
              Student
              <ArrowForwardIcon />
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ marginTop: "20px" }}>
          {showing == "currentTest" && <CurrentTest {...propsToCurrentTest} />}
          {showing == "editTest" && <EditTest {...propsToEditTest} />}
          {showing == "wordList" && <WordList {...propsToWordList} />}
        </Box>
      </Container>
    </div>
  );
}

export default TeacherView;
