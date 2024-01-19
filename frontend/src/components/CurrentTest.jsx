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

/**
 * React functional component representing the current test in use.
 * @component
 * @param {object} props Props passed to the component.
 * @param {string} props.fromLanguage The question language of the current test.
 * @param {string} props.toLanguage The answer language of the current test.
 * @param {object[]} props.currentTestWords List of words in the current test with {question, answer}.
 * @param {object} props.currentTest The current test object.
 * @param {object[]} props.words List of all words from the database.
 * @param {function} props.fetchTests Function to fetch all tests.
 * @return {JSX.Element} JSX element representing the current test.
 */
function CurrentTest(props) {
  /**
   * Columns for the datagrid, last one is a delete button
   * @type {array}
   */
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

  /**
   * Event handler for the delete button click. Deletes a word pair from the current test.
   * @function
   * @param {object} e The event object.
   * @param {object} row The row data.
   */
  const onButtonClick = (e, row) => {
    e.stopPropagation();
    deleteWordPair(row);
  };

  /**
   * Function to delete a word pair from the current test.
   * @function
   * @async
   * @param {object} row The row data to be deleted.
   */
  const deleteWordPair = async (row) => {
    //Making a new row without the word pair
    const newCompleteRow = { ...props.currentTest };
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

  /**
   * Rows for the datagrid generated from currentTestWords.
   * @type {array}
   */
  let rows = props.currentTestWords.map((wordPair) => ({
    id: wordPair.id,
    fromWord: wordPair.from_word,
    toWord: wordPair.to_word,
  }));

  /**
   * State for keeping track if the dialog is open
   * @type {boolean}
   */
  const [open, setOpen] = useState(false);

  /**
   * Event handler for the opening of the dialog.
   * @function
   */
  const handleClickOpen = () => {
    setOpen(true);
    checkAvailableWords();
  };

  /**
   * Event handler for the closing of the dialog.
   * @function
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * State for availableWords that can be added to the current test.
   * @type {array}
   */
  const [availableWords, setAvailableWords] = useState([]);

  /**
   * Function that checks the used languages and goes through the words
   * checking which words have those languages filled.
   * @function
   */
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
          return false;
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

  /**
   * State for the word that was chosen from the dropdown in the dialog.
   * @type {string}
   */
  const [pickedWord, setPickedWord] = useState("");

  /**
   * Function that add the new words to current_test in backend
   * and then emptyes pickedWord state.
   * Finally use fetchTests to trigger rerender.
   * @async
   * @function
   */
  const updateTestWordsToBackend = async () => {
    let row = { ...props.currentTest };
    row.words.push({
      from_word: pickedWord.label,
      to_word: pickedWord.secondary,
    });
    setPickedWord("");

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/tests/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(row),
      });
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
