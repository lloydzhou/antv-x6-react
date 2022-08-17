import React from 'react';
import './App.css';

import Graph, { Grid, Background, Clipboard, Keyboard, MouseWheel, Connecting } from './lib'

function App() {
  return (
    <div className="App">
      <Graph>
        <Grid />
        <Background />
        <Clipboard />
        <Keyboard />
        <MouseWheel />
        <Connecting />
      </Graph>
    </div>
  );
}

export default App;
