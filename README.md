# antv-x6-react
React components for building x6 editors

> 参照[lloydzhou/antv-x6-vue](https://github.com/lloydzhou/antv-x6-vue)实现组件抽象

## 核心思想
1. 由于[x6](https://www.npmjs.com/package/@antv/x6)主要面向编辑场景，所以对每一个节点有更多的交互逻辑。所以，将x6的Shape抽象成组件，每一个组件负责管理自己的生命周期。
2. 针对复杂的自定义图形，利用x6支持渲染html组件[antv-x6-html2](https://github.com/lloydzhou/antv-x6-html2)的功能，节点渲染交给当前组件，将图形相关逻辑交给x6。

### Online Demos
1. [基础示例](https://codesandbox.io/s/antv-x6-react-demo-jjvcv0)使用了`antd`的`InputNumber`（一个带按钮的输入框）展示了自定义组件如何做到和x6做数据交互
2. [swimlane 泳道图](https://codesandbox.io/s/antv-x6-react-swimlane-uy01jp)参照`x6`官方示例实现
3. [DAG画布](https://codesandbox.io/s/antv-x6-react-dag-m8vcgb)参照`x6`官方的DAG示例实现`AlgoNode`的节点逻辑与官方示例相比较处理起来更简单
4. [ER图](https://codesandbox.io/s/antv-x6-react-er-demo-61m60o)参照`x6`官方的ER图示例
5. [展开收起树形图](https://codesandbox.io/s/antv-x6-react-expand-tree-jfrnnz)参照`x6`官方的示例


## 安装
```
yarn add antv-x6-react
```

## Components
- [x] 提供`Graph`容器以及`GraphContext`获取`x6`的`graph`对象。可以利用这个对象操作画布，绑定事件。
- [x] 包装`Shape`作为`react`组件，封装的组件有：

类 | shape 名称| 描述
-- | -- | --
Node | rect | 等同于Shape.Rect
Edge | edge | 等同于Shape.Edge
Shape.Rect | rect | 矩形。
Shape.Circle | circle | 圆形。
Shape.Ellipse | ellipse | 椭圆。
Shape.Polygon | polygon | 多边形。
Shape.Polyline | polyline | 折线。
Shape.Path | path | 路径。
Shape.Image | image | 图片。
Shape.HTML | html | HTML 节点，使用 foreignObject 渲染 HTML 片段。
Shape.TextBlock | text-block | 文本节点，使用 foreignObject 渲染文本。
Shape.BorderedImage | image-bordered | 带边框的图片。
Shape.EmbeddedImage | image-embedded | 内嵌入矩形的图片。
Shape.InscribedImage | image-inscribed | 内嵌入椭圆的图片。
Shape.Cylinder | cylinder | 圆柱。
Shape.Edge | edge | 边。
Shape.DoubleEdge | double-edge | 双线边。
Shape.ShadowEdge | shadow-edge | 阴影边。

**另外提供帮助函数**
名称| 描述
 -- | --
useCell | 使用这个函数可以通过传递markup之类的参数自定义节点
useCellEvent | 通过这个函数绑定事件到cell上面


- [x] 提供内置的一些组件

名称| 描述
 -- | --
Grid | 渲染网格
Background | 渲染背景
Scroller | 滚动组件
Clipboard | 剪贴板，配合`Keyboard`组件可以使用`ctrl+c`/`ctrl+x`/`ctrl+v`
Keyboard | 键盘快捷键
MouseWheel | 鼠标滚轮，支持使用滚轮实现画布放大缩小
Connecting | 配置连线相关参数和帮助方法

- [x] Widgets

名称| 描述
 -- | --
Snapline | 对齐线
Selection | 点选/框选
MiniMap | 小地图
Contextmenu | 右键菜单

## [demo](https://github.com/lloydzhou/antv-x6-react/blob/master/src/App.tsx)
```jsx
import Graph, { Grid, Background, Clipboard, Keyboard, MouseWheel, Connecting } from './lib'
import { Node, Edge, ReactNode } from './lib'
import { Selection, MiniMap, ContextMenu, Portal } from './lib'

function Node1(props: any) {
  const { node } = props
  const [num, setNum] = React.useState(0)
  React.useEffect(() => {
    node.on('change:data', () => setNum(node.getData().num))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return <Button onMouseDown={e => e.stopPropagation()} onClick={e => node.setData({ num: num + 1 })}>Ant Button {num}</Button>
}

function App() {
  return (
    <div className="App">
      {/* 内部会自动判断，只要这个组件被挂载了就使用portal模式，否则使用ReactDOM */}
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
        <ReactNode id="999" x="650" y="200" data={{num: 2}} component={Node1} />
        <ReactNode id="99" x="500" y="200" data={{num: 2}} component={Node1} />
        <ReactNode id="9" x="500" y="300" data={{num: 2}} component={Node1} primer="circle" />
        <Edge source="1" target="2" />
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
```


