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

function WordList(props) {
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
        method: "DELETE"
      });
      console.log("deleted");
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
    console.log(updatedWord);
    try {
      const hr = await fetch(`${import.meta.env.VITE_API_URL}/api/words/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWord),
      });
      const updatedWordFromBackend = await hr.json();
      console.log("Updated word:", updatedWordFromBackend);
      props.fetchWords();
      return updatedWordFromBackend;
    } catch (error) {
      console.error("Error updating word:");
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
        <Button>Add word</Button>
      </Box>
    </Grid>
  );
}

export default WordList;
