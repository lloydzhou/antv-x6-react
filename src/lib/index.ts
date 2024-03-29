// @ts-nocheck
import Graph from './Graph'
import GraphContext, { CellContext, ContextMenuContext } from './GraphContext'
import Shape, { Node, Rect, Edge, Cell, useCell, useCellEvent } from './Shape'
import ReactNode from './ReactShape'
import { Portal } from './portal'
import { HTML2 } from 'antv-x6-html2'
// import Port, { PortGroup } from './Port'
import Grid from './components/Grid'
import Background from './components/Background'
import Clipboard from './components/Clipboard'
import Scroller from './components/Scroller'
import Keyboard from './components/Keyboard'
import MouseWheel from './components/MouseWheel'
import Connecting from './components/Connecting'

import Widgets from './widgets'
const { Snapline, Selection, MiniMap, Stencil, StencilGroup, ContextMenu, useContextMenu } = Widgets
const { View: HTML2View, Node: HTML2Shape } = HTML2

export {
  Graph,
  GraphContext, CellContext, ContextMenuContext,
  Shape,
  Node,
  Rect,
  Edge,
  Cell,
  useCell, useCellEvent,
  Grid,
  Background,
  Clipboard,
  Selection,
  Scroller,
  Keyboard,
  MouseWheel,
  Connecting,
  Widgets,
  MiniMap,
  Snapline,
  Stencil, StencilGroup,
  ContextMenu, useContextMenu,
  Portal, HTML2, HTML2Shape, HTML2View,
  ReactNode,
  // Port, PortGroup,
}


export default Graph

