import Grid from "@mui/material/Grid";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function WordList(props) {
  const columns = [
    { field: "id", headerName: "Id", width: 60 },
    { field: "tag", headerName: "Tag", width: 130 },
    { field: "english", headerName: "English", width: 130 },
    { field: "finnish", headerName: "Finnish", width: 130 },
    { field: "swedish", headerName: "Swedish", width: 130 },
    { field: "german", headerName: "German", width: 130 },
    { field: "italian", headerName: "Italian", width: 130 },
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

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h5" sx={{margin: "20px"}}>Words</Typography>
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
          checkboxSelection
        />
      </div>
    </Grid>
  );
}

export default WordList;
