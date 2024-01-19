import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentView from "./components/StudentView.jsx";
import TeacherView from "./components/TeacherView.jsx";

/**
 * React functional component representing the main application.
 * @component
 * @return {JSX.Element} JSX element representing the application.
 */
function App() {
  /**
   * State for all words from the database
   * @type {array}
   */
  const [words, setWords] = useState([]);

  /**
   * State for currently used question language
   * @type {string}
   */
  const [fromLanguage, setFromLanguage] = useState("");

  /**
   * State for currently used answer language
   * @type {string}
   */
  const [toLanguage, setToLanguage] = useState("");

  /**
   * State for all tests in database
   * @type {array}
   */
  const [tests, setTests] = useState([]);

  /**
   * State for current test information
   * @type {array}
   */
  const [currentTest, setCurrentTest] = useState({});
  /**
   * State for words in current test
   * @type {array}
   */
  const [currentTestWords, setCurrentTestWords] = useState([]);

  /**
   * Function that fetched all word data from backend and sets it to words state.
   * @function
   * @async
   * @return {Promise} Promise representing the completion of the task.
   */
  const fetchWords = async () => {
    let hr = await fetch(`${import.meta.env.VITE_API_URL}/api/words`);
    let data = await hr.json();
    setWords(data);
  };

  /**
   * Function that fetched all test data from backend and sets it to tests state.
   * Also sets currentTest, currentTestWords, fromLanguage and toLanguage states.
   * @function
   * @async
   * @return {Promise} Promise representing the completion of the task.
   */
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

  /**
   * UseEffect that only trigger on the firt renders and
   * uses fetchWords and fetchTests to fetch the data from the backend.
   */
  useEffect(() => {
    fetchWords();
    fetchTests();
  }, []);

  /**
   * All the props that are needed for the TeacherView component.
   * @type {object}
   */
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

  /**
   * All the props that are needed for the StudentView component.
   * @type {object}
   */
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
