import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function StudentView(props) {
  const navigate = useNavigate();

  //Rows and columns for the table
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

  //Initial rows to answers to copy
  const tempRows = props.currentTestWords.map((word) => ({
    id: word.id,
    fromWord: word.from_word,
    toWord: "",
  }));

  //State that stores questions and aswers
  const [answers, setAnswers] = useState([...tempRows]);

  //Rows to be answers so that filled answers stay visible
  const rows = [...answers];

  //Add filled answer to the state
  const addWordToAnswers = (wordPair) => {
    let tempArray = [...answers];
    const updatedTempArray = tempArray.map((word) => {
      if (word.fromWord === wordPair.fromWord) {
        return { ...word, toWord: wordPair.toWord };
      }
      return word;
    });
    setAnswers(updatedTempArray);

    //processRowUpdate needs to return the new row
    return wordPair;
  };

  //Necessary function for autogrid
  const handleProcessRowUpdateError = (error) => {
    console.log(error);
  };

  //State for the dialog
  const [open, setOpen] = useState(false);

  //Dialog open and close functions
  const handleClickOpen = () => {
    setOpen(true);
    checkCorrectAnswers();
  };

  const handleClose = () => {
    setOpen(false);
  };

  //If student want to continue, keep the correct answers but empty wrong ones
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

  //If student wants to start over, empty all answers
  const handleCloseStartOver = () => {
    emptyAllAnswers();
    setOpen(false);
  };

  //Function that emptyes answers
  const emptyAllAnswers = () => {
    const emptyAnswers = answers.map((answer) => ({ ...answer, toWord: "" }));
    setAnswers(emptyAnswers);
  };

  //State for the score
  const [score, setScore] = useState("");

  //Function that check how many answers are correct
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
          <Typography>Learn Languages</Typography>
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
