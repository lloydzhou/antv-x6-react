# antv-x6-react

## 核心思想
1. 由于[x6](https://www.npmjs.com/package/@antv/x6)主要面向编辑场景，所以对每一个节点有更多的交互逻辑。所以，将x6的Shape抽象成组件，每一个组件负责管理自己的生命周期。
2. 针对复杂的自定义图形，利用x6支持渲染vue组件[@antv/x6-react-shape](https://www.npmjs.com/package/@antv/x6-react-shape)的功能，同时利用slots将节点渲染交给当前组件，将图形相关逻辑交给x6。
```


