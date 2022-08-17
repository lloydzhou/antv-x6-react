# antv-x6-react

> 参照[lloydzhou/antv-x6-vue](https://github.com/lloydzhou/antv-x6-vue)实现组件抽象

## 核心思想
1. 由于[x6](https://www.npmjs.com/package/@antv/x6)主要面向编辑场景，所以对每一个节点有更多的交互逻辑。所以，将x6的Shape抽象成组件，每一个组件负责管理自己的生命周期。
2. 针对复杂的自定义图形，利用x6支持渲染react组件[@antv/x6-react-shape](https://www.npmjs.com/package/@antv/x6-react-shape)的功能，节点渲染交给当前组件，将图形相关逻辑交给x6。


## demo
```js
import Graph, { Grid, Background, Clipboard, Keyboard, MouseWheel, Connecting } from './lib'
import { Node, Edge } from './lib'
import { Selection, MiniMap, ContextMenu } from './lib'

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
        <Selection />
        <MiniMap />
        <Node id="1" x="100" y="100" label="node1" />
        <Node id="2" x="200" y="200" label="node2" />
        <Edge source="1" target="2" />
        <ContextMenu>
          <ul style={{background: '#fff'}}>
            <li><a>菜单1</a></li>
            <li><a>菜单2</a></li>
            <li><a>菜单3</a></li>
          </ul>
        </ContextMenu>
      </Graph>
    </div>
  );
}
```


