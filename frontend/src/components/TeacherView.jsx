import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

function TeacherView() {
  return (
    <div>
      <Box>
        <button>Choose languages</button>
        <button>Coose words</button>
        <ul>{props.practiseWords}</ul>
        <button>Save</button>
      </Box>
    </div>
  );
}

export default TeacherView;
