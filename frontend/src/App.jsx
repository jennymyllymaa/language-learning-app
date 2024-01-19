//import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentView from "./components/StudentView.jsx";
import TeacherView from "./components/TeacherView.jsx";
//import { AppBar, Toolbar, Typography, Button } from "@mui/material";

function App() {
  //All words from the database
  const [words, setWords] = useState([]);
  //Currently used languages
  const [fromLanguage, setFromLanguage] = useState("");
  const [toLanguage, setToLanguage] = useState("");
  //All tests in database
  const [tests, setTests] = useState([]);
  //List of words in the current test with {question, answer}
  const [currentTest, setCurrentTest] = useState({});
  const [currentTestWords, setCurrentTestWords] = useState([]);

  //Function to fetch all words from backend and set them to words state
  const fetchWords = async () => {
    let hr = await fetch(`${import.meta.env.VITE_API_URL}/api/words`);
    let data = await hr.json();
    setWords(data);
  };

  //Function to fetch all words from backend and set them to words state
  const fetchTests = async () => {
    let hr = await fetch(`${import.meta.env.VITE_API_URL}/api/tests`);
    let data = await hr.json();
    setTests(data);
    //Set first test aka current_test as currentTest
    setCurrentTest(data[0]);
    setFromLanguage(data[0].from_language);
    setToLanguage(data[0].to_language);
    let wordPairs = [];
    //Add id to words for the datagrids
    let idToUse = 1;
    for (const index in data[0].words) {
      const wordPair = data[0].words[index];
      wordPairs.push({
        id: idToUse,
        from_word: wordPair.from_word,
        to_word: wordPair.to_word,
      });
      idToUse++;
    }
    setCurrentTestWords(wordPairs);
  };

  //Use fetchWords and fetsTests on the first render
  useEffect(() => {
    fetchWords();
    fetchTests();
  }, []);

  //Props for TeacherView component
  const propsToTeacherView = {
    fetchWords,
    fetchTests,
    words,
    setWords,
    currentTest,
    setCurrentTest,
    fromLanguage,
    setFromLanguage,
    toLanguage,
    setToLanguage,
    tests,
    currentTestWords,
    setCurrentTestWords,
  };

  //Props for StudentView component
  const propsToStudentView = {
    fromLanguage,
    toLanguage,
    currentTestWords,
  };

  return (
    <BrowserRouter>
      <div className="App">
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
    </BrowserRouter>
  );
}

export default App;
