import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StudentView from "./components/StudentView.jsx";
import TeacherView from "./components/TeacherView.jsx";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

function App() {
  //All words from the database
  const [words, setWords] = useState([]);
  //Currently used languages,  default is from English to Finnish
  const [fromLanguage, setFromLanguage] = useState("English");
  const [toLanguage, setToLanguage] = useState("Finnish");
  //List of words in the current test with {question, answer}
  const [testWords, setTestWords] = useState([]);

  //Function to fetch all words from backend and set them to words state
  const fetchWords = async () => {
    let hr = await fetch(`${import.meta.env.VITE_API_URL}/api/words`);
    let data = await hr.json();
    setWords(data);
    console.log(data);
  };

  //Use fetchWords on the first render
  useEffect(() => {
    fetchWords();
  }, []);

    const propsToTeacherView = {
      fetchWords,
      words,
      setWords,
      testWords,
      setTestWords,
      fromLanguage,
      setFromLanguage,
      toLanguage,
      setToLanguage,
    };

    const propsToStudentView = {
      fromLanguage,
      toLanguage,
      practiseWords: testWords,
    };

  return (
    <BrowserRouter>
      <Container maxWidth="md">
        <div className="App">
          {/* <AppBar>
            <Toolbar>
              <Typography>Learn Languages</Typography>
              <Button sx={{ marginLeft: "auto" }} variant="contained" color="info">
                Teacher
              </Button>
            </Toolbar>
          </AppBar> */}
          <h1>Learn Languages</h1>

          <div className="mainNavigation">
            <div>
              <Link to="/">
                <button>Student</button>
              </Link>
              <Link to="/teacher">
                <button>Teacher</button>
              </Link>
            </div>
          </div>

          <div>
            <Routes>
              <Route
                path="/"
                element={<StudentView {...propsToStudentView} />}
              />
              <Route
                path="/teacher"
                element={<TeacherView {...propsToTeacherView} />}
              />
            </Routes>
          </div>
        </div>
      </Container>
    </BrowserRouter>
  );
}

export default App;
