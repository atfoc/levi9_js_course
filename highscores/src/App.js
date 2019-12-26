import React from 'react';
import {Table} from "./Table";
import {HighScores} from "./HighScores";

function App() {
  return (
      <div style={{width: '100vw', display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
          <div style={{width: '50vw'}}>
              <HighScores/>
          </div>
      </div>

  );
}

export default App;
