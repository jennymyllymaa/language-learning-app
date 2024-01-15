import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StudentView from "./components/StudentView.jsx";
import TeacherView from "./components/TeacherView.jsx";
import Container from "@mui/material/Container";

function App() {
  //All words from the database
  const [words, setWords] = useState([]);
  //Currently used language with {fromLanguage, toLanguage}
  const [languages, setLanguages] = useState({});
  //List of words in the current test with {question, answer}
  const [practiseWords, setPractiseWords] = useState([]);

  const propsToTeacherView = {
    words,
    practiseWords,
    setPractiseWords,
    languages,
    setLanguages
  };

  const propsToStudentView = {
    languages,
    practiseWords
  };

  //Function to fetch all words from backend and set them to words state
  const fetchWords = async () => {
    let hr = await fetch(`${import.meta.env.VITE_API_URL}/api/words`);
    let data = await hr.json();
    setWords(data);
  };

  //Use fetchWords on the first render
  useEffect(() => {fetchWords()}, []);

  return (
    <BrowserRouter>
      <Container maxWidth="md">
        <div className="App">
          <h1>Learn Languages</h1>

          <div className="mainNavigation">
            <div>
              <Link to="/">
                <button>Student</button>
              </Link>
              <Link to="teacher">
                <button>Teacher</button>
              </Link>
            </div>
          </div>

          <div>
            <Routes>
              <Route path="/" element={<StudentView {...propsToStudentView} />} />
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

export default App
