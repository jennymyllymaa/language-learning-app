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

function WordList(props) {
  const columns = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "tag", headerName: "Tag", width: 130, editable: true },
    { field: "english", headerName: "English", width: 130, editable: true },
    { field: "finnish", headerName: "Finnish", width: 130, editable: true },
    { field: "swedish", headerName: "Swedish", width: 130, editable: true },
    { field: "german", headerName: "German", width: 130, editable: true },
    { field: "italian", headerName: "Italian", width: 130, editable: true },
  ];

  const rows = props.words.map((word) => ({
    id: word.id,
    tag: word.tag,
    english: word.english,
    finnish: word.finnish,
    swedish: word.swedish,
    german: word.german,
    italian: word.italian,
  }));

  const mySaveOnServerFunction = (updatedRow) => {
    console.log(updatedRow);
  };

  const handleProcessRowUpdateError = (parametri) => {
    console.log(parametri);
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
            mySaveOnServerFunction(updatedRow)
          }
          onProcessRowUpdateError={(error) =>
            handleProcessRowUpdateError(error)
          }
        />
      </div>
      <Box>
        <Button>Update</Button>
        <Button>Delete</Button>
      </Box>
      <Box>
        <Button>Add word</Button>
      </Box>
    </Grid>
  );
}

export default WordList;
