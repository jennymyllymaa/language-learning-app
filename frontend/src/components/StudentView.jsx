import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

/**
 * React functional component for the student view.
 * @component
 * @param {object} props Props passed to the component.
 * @param {string} props.fromLanguage The source language of the current test.
 * @param {string} props.toLanguage The target language of the current test.
 * @param {object[]} props.currentTestWords List of words in the current test with {question, answer}.
 * @return {JSX.Element} JSX element representing the student view.
 */
function StudentView(props) {
  /**
   * Set a variable using useNavigate.
   */
  const navigate = useNavigate();

  /**
   * Rows and columns for the table.
   * @type {array}
   */
  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 100,
    },
    {
      field: "fromWord",
      headerName: `${props.fromLanguage}`,
      width: 220,
      editable: false,
    },
    {
      field: "toWord",
      headerName: `${props.toLanguage}`,
      width: 220,
      editable: true,
    },
  ];

  /**
   * Initial rows for answers to copy.
   * @type {array}
   */
  const tempRows = props.currentTestWords.map((word) => ({
    id: word.id,
    fromWord: word.from_word,
    toWord: "",
  }));

  /**
   * State that stores questions and aswers.
   * @type {array}
   */
  const [answers, setAnswers] = useState([...tempRows]);

  /**
   * Rows to be answers so that filled answers stay visible.
   * @type {array}
   */
  const rows = [...answers];

  /**
   * Function to add filled answer to the state.
   * @function
   * @param {object} wordPair The question and answer as an object.
   * @return {object} The processRowUpdate needs to return the new row.
   */
  const addWordToAnswers = (wordPair) => {
    let tempArray = [...answers];
    const updatedTempArray = tempArray.map((word) => {
      if (word.fromWord === wordPair.fromWord) {
        return { ...word, toWord: wordPair.toWord };
      }
      return word;
    });
    setAnswers(updatedTempArray);
    return wordPair;
  };

  /**
   * Necessary function for autogrid.
   * @function
   * @param {Error} error The error object.
   */
  const handleProcessRowUpdateError = (error) => {
    console.error(error);
  };

  /**
   * State for the dialog.
   * @type {boolean}
   */
  const [open, setOpen] = useState(false);

  /**
   * Function to open the dialog.
   * @function
   */
  const handleClickOpen = () => {
    setOpen(true);
    checkCorrectAnswers();
  };

  /**
   * Function to close the dialog.
   * @function
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Function when student want to continue, keep the correct answers but empty wrong ones.
   * @function
   */
  const handleCloseContinue = () => {
    const updatedAnswers = [];

    //Loop asnwers to see which are incorrect and set those to ""
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      let found = false;
      for (let j = 0; j < props.currentTestWords.length; j++) {
        const word = props.currentTestWords[j];

        if (word.from_word == answer.fromWord) {
          found = true;
          if (word.to_word != answer.toWord) {
            updatedAnswers.push({ ...answer, toWord: "" });
          } else {
            updatedAnswers.push(answer);
          }
          break;
        }
      }
      if (!found) {
        updatedAnswers.push({ ...answer, toWord: "" });
      }
    }
    setAnswers(updatedAnswers);
    setOpen(false);
  };

  /**
   * Function when student wants to start over, empty all answers.
   * @function
   */
  const handleCloseStartOver = () => {
    emptyAllAnswers();
    setOpen(false);
  };

  /**
   * Function that emptyes answers.
   * @function
   */
  const emptyAllAnswers = () => {
    const emptyAnswers = answers.map((answer) => ({ ...answer, toWord: "" }));
    setAnswers(emptyAnswers);
  };

  /**
   * State for the score.
   * @type {string}
   */
  const [score, setScore] = useState("");

  /**
   * Function that check how many answers are correct and sets it to score.
   * @function
   */
  const checkCorrectAnswers = () => {
    let correctCount = 0;
    let maxCount = answers.length;
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const correspondingWord = props.currentTestWords.find(
        (word) => word.from_word === answer.fromWord
      );
      if (correspondingWord.to_word === answer.toWord) {
        correctCount++;
      }
    }
    const result = `${correctCount}/${maxCount}`;
    setScore(result);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4">Learn Languages</Typography>
          <Button
            sx={{ marginLeft: "auto" }}
            variant="contained"
            color="info"
            onClick={() => {
              navigate("/teacher");
            }}
          >
            Teacher
            <ArrowForwardIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5" sx={{ margin: "20px" }}>
            Test you language skills
          </Typography>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 50]}
              hideFooterSelectedRowCount
              processRowUpdate={(updatedRow, originalRow) =>
                addWordToAnswers(updatedRow)
              }
              onProcessRowUpdateError={(error) =>
                handleProcessRowUpdateError(error)
              }
            />
          </div>
          <Box>
            <Button onClick={handleClickOpen}>Submit</Button>
            <Button onClick={emptyAllAnswers}>Empty</Button>
          </Box>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Score</DialogTitle>
            <DialogContent>
              <DialogContentText>{score}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseContinue}>Continue</Button>
              <Button onClick={handleCloseStartOver}>Start over</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Container>
    </>
  );
}

export default StudentView;
