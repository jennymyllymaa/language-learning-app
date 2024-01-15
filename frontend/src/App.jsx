import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StudentView from "./components/StudentView.jsx";
import TeacherView from "./components/TeacherView.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";


function App() {
  const [words, setWords] = useState([]);


  const testifetch = async () => {
    let hr = await fetch(`${import.meta.env.VITE_API_URL}/api/words`);
    let data = await hr.json();
    console.log(data);
    setWords(data);
  };

  let wordsArr = words.map((word) => <li key={word.id}>{word.english} - {word.finnish}</li>);

  return (
    <BrowserRouter>
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
            <p>Hello</p>
            <div>{wordsArr}</div>
            <button onClick={testifetch}>testi</button>
          </div>

          <div>
            <Routes>
              <Route path="/" element={<StudentView />} />
              <Route path="/teacher" element={<TeacherView />} />
            </Routes>
          </div>
        </div>
    </BrowserRouter>
  );
}

export default App
