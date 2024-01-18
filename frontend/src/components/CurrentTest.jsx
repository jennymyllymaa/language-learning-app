import Grid from "@mui/material/Grid";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";

function CurrentTest(props) {
  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 100,
    },
    { field: "fromWord", headerName: "From", width: 150 },
    { field: "toWord", headerName: "To", width: 150 },
    {
      field: "delete",
      headerName: "Delete",
      width: 80,
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

  const onButtonClick = (e, row) => {
    e.stopPropagation();
    console.log(row);
  };

  //   fromLanguage: props.fromLanguage,
  //   toLanguage: props.toLanguage,
  //   words: props.words,
  //   fetchTests: props.fetchTests,
  //   currentTest: props.currentTest,
  //   setCurrentTest: props.setCurrentTest,
  //   currentTestWords: props.currentTestWords,

  let rows = props.currentTestWords.map((wordPair) => ({
      id: wordPair.id,
      fromWord: wordPair.from_word,
      toWord: wordPair.to_word
    }));

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    checkAvailableWords();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [availableWords, setAvailableWords] = useState([]);

  const checkAvailableWords = () => {
  const firstLanguage = props.fromLanguage.toLowerCase();
  const secondLanguage = props.toLanguage.toLowerCase();
    let wordsArr = props.words.filter((wordData) => {
      return (
        wordData[firstLanguage] !== null && wordData[secondLanguage] !== null
      );
    });
    // Add label to the array for Autocomplete component
    // Add Secondary to help word recovery
    wordsArr = wordsArr.map((wordData) => {
      return { ...wordData, label: wordData[firstLanguage], secondary: wordData[secondLanguage] };
    });
    setAvailableWords(wordsArr);
  };

  const [pickedWord, setPickedWord] = useState("");


  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h5" sx={{ margin: "20px" }}>
        Test
      </Typography>
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
      <Box>
        <Button onClick={handleClickOpen}>dialogi</Button>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries(formData.entries());

            const newWord = {
              fromWord: pickedWord.label,
              toWord: pickedWord.secondary,
            };
            console.log(newWord);
            //saveNewWordToBackend(newWord);
            //console.log("testiValue: ", pickedWord);
            handleClose();
          },
        }}
      >
        <DialogTitle>New word</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a word from existing words.
          </DialogContentText>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={availableWords}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="New Word" />}
            value={pickedWord}
            onChange={(event, newString) => setPickedWord(newString)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default CurrentTest;
