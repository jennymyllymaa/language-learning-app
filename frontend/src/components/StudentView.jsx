import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Prompt from "./Prompt.jsx"

function StudentView() {
  return (
    <Box>
      <Grid container rowSpacing={1} columnSpacing={2}>
        <Grid item xs={6}>
          <Prompt />
        </Grid>
        <Grid item xs={6}>
          <Paper>Vastaus</Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentView;
