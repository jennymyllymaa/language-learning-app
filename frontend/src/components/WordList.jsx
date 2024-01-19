import Grid from "@mui/material/Grid";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";

/**
 * React functional component representing the WordList view.
 * @component
 * @param {object} props Props passed to the component.
 * @param {object[]} props.words List of words from the database.
 * @param {Function} props.fetchWords Function to fetch all words from the backend.
 * @return {JSX.Element} JSX element representing the WordList view.
 */
function WordList(props) {
  /**
   * Columns for the table. Last one is a delete button for each row.
   * @type {array}
   */
  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 40,
    },
    {
      field: "tag",
      headerName: "Tag",
      width: 80,
      editable: true,
    },
    {
      field: "english",
      headerName: "English",
      width: 125,
      editable: true,
    },
    {
      field: "finnish",
      headerName: "Finnish",
      width: 125,
      editable: true,
    },
    {
      field: "swedish",
      headerName: "Swedish",
      width: 125,
      editable: true,
    },
    {
      field: "german",
      headerName: "German",
      width: 125,
      editable: true,
    },
    {
      field: "italian",
      headerName: "Italian",
      width: 125,
      editable: true,
    },
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
   * Rows for the table.
   * @type {array}
   */
  const rows = props.words.map((word) => ({
    id: word.id,
    tag: word.tag,
    english: word.english,
    finnish: word.finnish,
    swedish: word.swedish,
    german: word.german,
    italian: word.italian,
  }));

  /**
   * Event handler function for the delete button on every row.
   * @function
   * @param {object} e The event object.
   * @param {object} row The row data.
   */
  const onButtonClick = (e, row) => {
    e.stopPropagation();
    deleteRow(row);
  };

  /**
   * Function to delete a word on the backend.
   * Finally use fetchWords to trigger rerender.
   * @function
   * @param {object} row The row data.
   */
  const deleteRow = async (row) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/words/${row.id}`, {
        method: "DELETE",
      });
      props.fetchWords();
    } catch (error) {
      console.error("Error deleting row.");
    }
  };

  /**
   * Function that sends updatedRow for the correct function
   * and return the row which is necessary for the processRowUpdate.
   * @function
   * @param {object} updatedRow The row data.
   * @return {object} The updated word data.
   */
  const saveWordUpdateToBackend = (updatedRow) => {
    const updatedWord = updateWord(updatedRow);
    return updatedWord;
  };

  /**
   * Necessary function for the autogrid.
   * @function
   * @param {Error} error The error object.
   */
  const handleProcessRowUpdateError = (error) => {
    console.error(error);
  };

  /**
   * Function to update a word on the backend.
   * In the end use fetchWords to trigger rerender.
   * @async
   * @function
   * @param {object} updatedWord The updated word data.
   * @return {Promise} Promise representing the completion of the task.
   */
  const updateWord = async (updatedWord) => {
    try {
      const hr = await fetch(`${import.meta.env.VITE_API_URL}/api/words/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWord),
      });
      const updatedWordFromBackend = await hr.json();
      props.fetchWords();
      return updatedWordFromBackend;
    } catch (error) {
      console.error("Error updating word.");
    }
  };

  /**
   * State for the dialog, is it open or closed.
   * @type {boolean}
   */
  const [open, setOpen] = useState(false);

  /**
   * Function to open dialog.
   * @function
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * Function to close dialog.
   * @function
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Function that saves the added word to database
   * and uses fetchWords to trigger rerender.
   * @function
   * @async
   * @param {object} word The new word data.
   */
  const saveNewWordToBackend = async (word) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/words/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(word),
      });
      props.fetchWords();
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
        Words
      </Typography>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id} // Provide a custom getRowId function
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 50]}
          hideFooterSelectedRowCount
          processRowUpdate={(updatedRow, originalRow) =>
            saveWordUpdateToBackend(updatedRow)
          }
          onProcessRowUpdateError={(error) =>
            handleProcessRowUpdateError(error)
          }
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
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());

            //Check that at least two inputs (not including tag) has been filled
            const filledLanguages = Object.entries(formJson).filter(
              ([key, value]) => key !== "tag" && value.trim() !== ""
            ).length;

            if (filledLanguages < 2) {
              alert("Please fill in at least two languages.");
              return;
            }

            const newWord = {
              tag: formJson.tag,
              english: formJson.english,
              finnish: formJson.finnish,
              swedish: formJson.swedish,
              german: formJson.german,
              italian: formJson.italian,
            };
            saveNewWordToBackend(newWord);
            handleClose();
          },
        }}
      >
        <DialogTitle>New word</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add the word on as many languages from these options as you want.
            You can also add a tag (fruit, animal.. etc).
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="tag"
                name="tag"
                label="Tag"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="english"
                name="english"
                label="English"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="finnish"
                name="finnish"
                label="Finnish"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="swedish"
                name="swedish"
                label="Swedish"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="german"
                name="german"
                label="German"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="italian"
                name="italian"
                label="Italian"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default WordList;
