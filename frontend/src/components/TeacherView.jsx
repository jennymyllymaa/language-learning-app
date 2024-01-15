import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useState } from 'react';

function TeacherView(props) {
  //State that holdds the available words pairs for selected languages as {question, answer}
  const [availableWords, setAvailableWords] = useState([]);

  //Function that uses languages to fetch available wordpairs from backend and set those to availableWords

  return (
    <div>
      <Box>
        <button>Choose languages</button>
        <button>Choose words</button>
        <ul>{props.practiseWords}</ul>
        <button>Save</button>
      </Box>
    </div>
  );
}

export default TeacherView;
