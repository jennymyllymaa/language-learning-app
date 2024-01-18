import Grid from "@mui/material/Grid";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextareaAutosize, Typography } from "@mui/material";
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

function WordList(props) {
  const [addingWord, setAddingWord] = useState(false);

  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 40,
      //disableClickEventBubbling: true,
    },
    {
      field: "tag",
      headerName: "Tag",
      width: 80,
      editable: true,
      //disableClickEventBubbling: true,
    },
    {
      field: "english",
      headerName: "English",
      width: 125,
      editable: true,
      //disableClickEventBubbling: true,
    },
    {
      field: "finnish",
      headerName: "Finnish",
      width: 125,
      editable: true,
      //disableClickEventBubbling: true,
    },
    {
      field: "swedish",
      headerName: "Swedish",
      width: 125,
      editable: true,
      //disableClickEventBubbling: true,
    },
    {
      field: "german",
      headerName: "German",
      width: 125,
      editable: true,
      //disableClickEventBubbling: true,
    },
    {
      field: "italian",
      headerName: "Italian",
      width: 125,
      editable: true,
      //disableClickEventBubbling: true,
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

  const onButtonClick = (e, row) => {
    e.stopPropagation();
    deleteRow(row);
  };

  const rows = props.words.map((word) => ({
    id: word.id,
    tag: word.tag,
    english: word.english,
    finnish: word.finnish,
    swedish: word.swedish,
    german: word.german,
    italian: word.italian,
  }));

  // Function to delete a word on the backend
  const deleteRow = async (row) => {
    console.log(row);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/words/${row.id}`, {
        method: "DELETE",
      });
      console.log("deleted");
      // Update words state to rerender
      props.fetchWords();
    } catch (error) {
      console.error("Error deleting row.");
    }
  };

  const saveWordUpdateToBackend = (updatedRow) => {
    const updatedWord = updateWord(updatedRow);
    return updatedWord;
  };

  const handleProcessRowUpdateError = (parametri) => {
    console.log(parametri);
  };

  // Function to update a word on the backend
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
      // Update words state to rerender
      props.fetchWords();
      return updatedWordFromBackend;
    } catch (error) {
      console.error("Error updating word.");
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveNewWordToBackend = async (word) => {
    console.log(word);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/words/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(word),
      });
      //const newWordFromBackend = await hr.json();
      // Update words state to rerender
      //props.fetchWords();
      //return updatedWordFromBackend;
      //console.log(newWordFromBackend);
      //return newWordFromBackend;
    } catch (error) {
      console.error("Error saving word.");
    }
  }

  const valiFuntio = async (sana) => {
    console.log("valifunktio: ", sana);
    await saveNewWordToBackend(sana);
    props.fetchWords();
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
      <div style={{ height: 500, width: "100%" }}>
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
        {/* <Button onClick={() => setAddingWord(!addingWord)}>Add word</Button> */}
        <Button onClick={handleClickOpen}>dialogi</Button>
      </Box>
      {addingWord && (
        <Grid>
          <TextField id="outlined-basic" label="Tag" variant="outlined" />
          <TextField id="outlined-basic" label="English" variant="outlined" />
          <TextField id="outlined-basic" label="Finnish" variant="outlined" />
          <TextField id="outlined-basic" label="Swedish" variant="outlined" />
          <TextField id="outlined-basic" label="German" variant="outlined" />
          <TextField id="outlined-basic" label="Italian" variant="outlined" />
        </Grid>
      )}
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
              italian: formJson.italian
            };
            //saveNewWordToBackend(newWord);
            valiFuntio(newWord);
            handleClose();
          },
        }}
      >
        <DialogTitle>New word</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add the word on as many languages from these options as you want. You can also add a tag (fruit, animal.. etc).
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
