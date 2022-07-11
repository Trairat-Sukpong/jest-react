import React, { useState } from 'react';
import { getHeroDetail } from "./api"
import './App.css';

function App() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  const handleSubmit = async () => {
    setLoading(true);
    const res = await getHeroDetail(text);
    setData(res);
    // console.log(data);
    setLoading(false);
  }

  return (
    <div>
      <label htmlFor="hero-name">Search</label>
      <input
        id="hero-name"
        placeholder="Type a hero name"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      {loading && <div>loading</div>}
      {data &&(
        <div>
          <img alt={`Avatar of ${data.name}`} src={data.avatar} />
          <div>
            <div>{data.name}</div>
            <div>{data.description}</div>
          </div>
        </div>)
      }
    </div>
  );
}

export default App;
