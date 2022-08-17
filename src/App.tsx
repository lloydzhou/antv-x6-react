import React from 'react';
import './App.css';

import Graph, { Grid, Background, Clipboard, Keyboard, MouseWheel, Connecting } from './lib'
import { Node, Edge } from './lib'

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
        <Node id="1" x="100" y="100" label="node1" />
        <Node id="2" x="200" y="200" label="node2" />
        <Edge source="1" target="2" />
      </Graph>
    </div>
  );
}

export default App;
