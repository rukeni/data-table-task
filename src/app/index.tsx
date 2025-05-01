import { useState } from 'react';

import viteLogo from '@/assets/vite.svg';
import reactLogo from '@/assets/react.svg';

import '@/styles/app.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a target="_blank" rel="noreferrer" href="https://vite.dev">
          <img className="logo" src={viteLogo} alt="Vite logo" />
        </a>
        <a target="_blank" rel="noreferrer" href="https://react.dev">
          <img className="logo react" src={reactLogo} alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
