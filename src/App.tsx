// @ts-ignore
import React from 'react';
import { Button, Menu } from 'antd'
import './App.css';

import Graph, { Grid, Background, Clipboard, Keyboard, MouseWheel, Connecting } from './lib'
import { Node, Edge, ReactNode } from './lib'
import { Selection, MiniMap, ContextMenu, Portal } from './lib'

import { useNodeSize } from './lib/ReactShape'

import { InputNumber } from 'antd'

function Node1(props: any) {
  useNodeSize(props)
  const { node, data = {} } = props;
  const { num = 0 } = data;
  return (
    <div style={{width: 150, border: '1px solid'}}>
      <Button onClick={(e) => node.setData({ num: num + 1 })}>
        Ant Button {num}
      </Button>
      <InputNumber value={num} onChange={num => node.setData({ num })} />
    </div>
  );
}

const PortalProvider = Portal.getProvider()

const data = { num: 1 }

function App() {
  const nodeRef = React.useRef()
  const edgeRef = React.useRef()
  return (
    <div className="App">
      {/* 只要这个被挂载了就能使用portal */}
      <PortalProvider />
      <Graph>
        <Grid />
        <Background />
        <Clipboard />
        <Keyboard />
        <MouseWheel />
        <Selection />
        <Connecting />
        <Node id="1" x="100" y="100" label="node1" />
        <Node id="2" x="200" y="200" label="node2" />
        <ReactNode id="999" x="650" y="200" data={data} component={Node1} onAdded={(e: any) => {
          console.log('onAdded', e)
        }} onChange={(e: any) => {
          console.log('onChange', e)
        }} />
        <ReactNode id="99" x="500" y="200" data={data} component={Node1} />
        <ReactNode id="9" x="500" y="300" data={data} component={Node1} primer="circle" />
        <ReactNode id="1111" x="700" y="300" attrs={{rect: { stroke: '#333' }}} nodeRef={nodeRef}>
          <div>hello react</div>
        </ReactNode>
        <Edge source="1" target="2" edgeRef={edgeRef} />
        <ContextMenu>
          <Menu style={{background: '#fff'}}>
            <Menu.Item>菜单1</Menu.Item>
            <Menu.Item>菜单2</Menu.Item>
            <Menu.Item>菜单3</Menu.Item>
          </Menu>
        </ContextMenu>
      </Graph>
    </div>
  );
}

export default App;
