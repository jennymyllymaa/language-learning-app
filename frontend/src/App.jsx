import { useState } from 'react'

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
    <div>
      <p>Hello</p>
      <div>{wordsArr}</div>
      <button onClick={testifetch}>testi</button>
    </div>
  );
}

export default App
