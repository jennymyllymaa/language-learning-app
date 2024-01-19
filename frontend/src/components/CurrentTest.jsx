import Grid from "@mui/material/Grid";
import { useState } from "react";
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
  // Columns for the datagrid, last one is a delete button
  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 100,
    },
    { field: "fromWord", headerName: `${props.fromLanguage}`, width: 200 },
    { field: "toWord", headerName: `${props.toLanguage}`, width: 200 },
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

  //Function for each rows delete button
  const onButtonClick = (e, row) => {
    e.stopPropagation();
    deleteWordPair(row);
  };

  // Function to delete a word pair from the current test
  const deleteWordPair = async (row) => {
    //Making a new row without the word pair
    const newCompleteRow = {...props.currentTest};
    let wordToDelete = row.fromWord;
    const updatedWords = newCompleteRow.words.filter((wordPair) => {
      return wordPair.from_word !== wordToDelete;
    });
    newCompleteRow.words = updatedWords;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/tests/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCompleteRow),
      });
      // Update tests state to rerender
      props.fetchTests();
    } catch (error) {
      console.error("Error deleting row.");
    }
  };

  //Rows for the datagrid
  let rows = props.currentTestWords.map((wordPair) => ({
    id: wordPair.id,
    fromWord: wordPair.from_word,
    toWord: wordPair.to_word,
  }));

  //State for if the dialog is open
  const [open, setOpen] = useState(false);

  //Open and close functions for the dialog
  const handleClickOpen = () => {
    setOpen(true);
    checkAvailableWords();
  };

  const handleClose = () => {
    setOpen(false);
  };

  //State for the availableWords for the dialog
  const [availableWords, setAvailableWords] = useState([]);

  //Function that check the used languages and goes through the words
  // checking which words have those languages filled
  const checkAvailableWords = () => {
    const firstLanguage = props.fromLanguage.toLowerCase();
    const secondLanguage = props.toLanguage.toLowerCase();
    console.log(props.currentTestWords);
    let wordsArr = props.words.filter((wordData) => {
      return (
        wordData[firstLanguage] !== null && wordData[secondLanguage] !== null
      );
    });

    //Filter out words that already are in the current test
    const existingWordsIds = props.currentTestWords.map((word) => word.id);
    wordsArr = wordsArr.filter((wordData) => {
      for (let i = 0; i < existingWordsIds.length; i++) {
        if (wordData.id === existingWordsIds[i]) {
          return false; // Exludes this word
        }
      }
      return true;
    });

    // Add label to the array for Autocomplete component
    // Add Secondary to help word recovery
    wordsArr = wordsArr.map((wordData) => {
      return {
        ...wordData,
        label: wordData[firstLanguage],
        secondary: wordData[secondLanguage],
      };
    });
    setAvailableWords(wordsArr);
  };

  //State for the selected word from dropdown
  const [pickedWord, setPickedWord] = useState("");

  //Function that add the new words to current_test in backend
  const updateTestWordsToBackend = async () => {
    let row = { ...props.currentTest };
    row.words.push({
      from_word: pickedWord.label,
      to_word: pickedWord.secondary,
    });
    //Empty pickedWord state
    setPickedWord("");

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/tests/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(row),
      });
      // Update tests state to rerender
      props.fetchTests();
    } catch (error) {
      console.error("Error saving word.");
    }
  };

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
      <div style={{ height: 400, width: "70%" }}>
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
        <Button onClick={handleClickOpen}>Add word</Button>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            updateTestWordsToBackend();
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
