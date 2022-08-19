// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Node as X6Node, Edge as X6Edge, Shape, Cell as BaseShape } from '@antv/x6'
import GraphContext, { CellContext } from './GraphContext';
import './html2'
import { Portal } from './portal'

export const useCellEvent = (name, handler, options={}) => {
  const { graph } = React.useContext(GraphContext);
  const { cell, once } = options

  const xhandler = (e) => {
    // 如果传了cell参数就使用cell_id判断一下触发事件的回调是不是对应到具体的元素上面
    const target = e.node || e.edge || e.cell || (e.view && e.view.cell)
    const target_id = target ? target.id : undefined
    const cell_id = cell ? cell.current ? cell.current.id : cell.id : undefined
    // console.log('xhandler', target_id, '===', cell_id, name, e)
    if (target_id) {
      if (target_id === cell_id) {
        // 如果事件是针对
        handler(e)
      }
    } else {
      handler(e)
    }
  }
  const clear = () => !once && graph.off(name, xhandler)
  useEffect(() => {
    if (once) {
      graph.once(name, xhandler)
    } else {
      graph.on(name, xhandler)
    }
    return () => clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // 将取消监听的函数返回，用户可以主动取消
  return clear
}

export const useCell = (props) => {
  const { onAdded, onRemoved, onChange, ...otherProps } = props
  const {
    id, shape = 'rect',
    markup, attrs, zIndex, visible, data, parent: p,
    source, target, vertices, router, connector, labels,
    x, y, width, height, angle, label, magnet, primer, ...otherOptions
  } = otherProps

  const { graph } = React.useContext(GraphContext)
  const cell = useRef()

  const [context, setContext] = useState({ cell: null })
  const parent = React.useContext(CellContext)
  // 避免injection not found警告
  // provide(portGroupContextSymbol, { name: '' })

  const added = (e) => onAdded && onAdded(e)
  const removed = (e) => onRemoved && onRemoved(e)

  useEffect(() => {
    // 从registry获取注册的类型，获取不到就使用Cell
    const ShapeClass = X6Node.registry.get(shape) || X6Edge.registry.get(shape) || BaseShape
    cell.current = new ShapeClass({
      id, shape,
      width: Number(width) || 160,
      height: Number(height) || 40,
      x: Number(x) || 0,
      y: Number(y) || 0,
      angle: Number(angle) || 0,
      // 以下是前面展开的变量
      markup, attrs, zIndex, visible, data, parent: p,
      source, target, vertices, router, connector, labels,
      label, magnet, primer,
      ...otherOptions
    })
    if (magnet === false || magnet === true) {
      cell.current.setAttrByPath(`${primer || cell.current.shape}/magnet`, !!magnet)
    }
    cell.current.once('added', added)
    cell.current.once('removed', removed)
    // 共享给子组件
    setContext({ cell: cell.current })
    // 当前节点添加到子节点
    if (parent && parent.cell) {
      parent.cell.addChild(cell.current)
    }
    graph.addCell(cell.current)

    return () => {
      // 当前节点从子节点移除
      if (parent && parent.cell) {
        // cell.current.removeFromParent()
        parent.cell.removeChild(cell.current)
      }
      graph.removeCell(cell.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // 默认给组件绑定一个监听change:*的回调
  useCellEvent('cell:change:*', ({ key, ...ev }) => onChange && onChange(ev), { cell })
  // 监听其他变化
  // useWatchProps(cell, otherProps)
  useEffect(() => { markup !== undefined && cell.current.setMarkup(markup) }, [markup, cell])
  useEffect(() => { attrs !== undefined && cell.current.setAttrs(attrs) }, [attrs, cell])
  useEffect(() => { zIndex !== undefined && cell.current.setZIndex(zIndex) }, [zIndex, cell])
  useEffect(() => { visible !== undefined && cell.current.setVisible(visible) }, [visible, cell])
  useEffect(() => { data !== undefined && cell.current.setData(data) }, [data, cell])
  useEffect(() => { p !== undefined && cell.current.setProp('parent', p) }, [p, cell])
  // setSource和setTarget稍微有点区别
  useEffect(() => { source !== undefined && cell.current.setSource(typeof source === 'string' ? { cell: source } : source) }, [source, cell])
  useEffect(() => { target !== undefined && cell.current.setTarget(typeof target === 'string' ? { cell: target } : target) }, [target, cell])
  useEffect(() => { vertices !== undefined && cell.current.setVertices(vertices) }, [vertices, cell])
  useEffect(() => { router !== undefined && cell.current.setRouter(router) }, [router, cell])
  useEffect(() => { connector !== undefined && cell.current.setConnector(connector) }, [connector, cell])
  useEffect(() => { labels !== undefined && cell.current.setLabels(labels) }, [labels, cell])
  useEffect(() => {
    if (x !== undefined && y !== undefined) {
      cell.current.setProp('position', {x: Number(x), y: Number(y)})
    }
  }, [x, y, cell])
  useEffect(() => {
    if (width !== undefined && height !== undefined) {
      cell.current.setProp('size', {width: Number(width), height: Number(height)})
    }
  }, [width, height, cell])
  useEffect(() => { angle !== undefined && cell.current.rotate(Number(angle), {absolute: true}) }, [angle, cell])
  useEffect(() => { label !== undefined && cell.current.setProp('label', label) }, [label, cell])
  useEffect(() => { angle !== undefined && cell.current.rotate(Number(angle), {absolute: true}) }, [angle, cell])

  // 增加配置是否可以连线
  useEffect(() => {
    if (magnet === false || magnet === true) {
      cell.current.setAttrByPath(`${primer || cell.current.shape}/magnet`, !!magnet)
    }
  }, [magnet, primer, cell])

  return [cell, context]
}

const Node: React.FC<{[key: string]: any}> = (props) => {
  const { children, ...otherProps } = props
  const [cell, context] = useCell(otherProps)
  return cell.current ? <CellContext.Provider value={context}>
    {children}
  </CellContext.Provider> : null
}

const Edge: React.FC<{[key: string]: any}> = (props) => {
  const { children, ...otherProps } = props
  // 默认给Edge一个默认的shape参数，否则回被初始化成Cell
  const [cell, context] = useCell({shape: 'edge', ...otherProps})
  return cell.current ? <CellContext.Provider value={context}>
    {children}
  </CellContext.Provider> : null
}

const ReactNode: React.FC<{[key: string]: any}> = (props) => {
  const { children, component, primer='rect', ...otherProps } = props

  // 使用一个内部的组件包裹一下，自动监听data变化
  const ComponentClass = component ? component : () => children
  const DataWatcher: React.FC<{[key: string]: any}> = (props) => {
    const { node } = props
    const [data, setData] = React.useState(node.getData())
    React.useEffect(() => {
      node.on('change:data', () => {
        setData(node.getData())
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <ComponentClass {...props} data={data} />
  }
  const wrap = Portal.wrap
  const [cell, context] = useCell({
    ...otherProps,
    shape: 'html2',
    primer,
    // 使用Portal.wrap包裹一层变成mount + unmount模式
    // 自动按照是否挂载PortalProvider自动选择是否使用Portal模式
    html: wrap(DataWatcher),
  })
  return cell.current ? <CellContext.Provider value={context}>
    {component && children}
  </CellContext.Provider> : null
}

const Cell = Node
const Rect = Node
const Shapes = { Node, Edge, Cell, ReactNode };
// 除了Edge，其他的都直接使用Cell
Object.keys(Shape).filter(n => n !== 'Edge').forEach(name => Shapes[name] = Node);

export {
  Shape,
  Cell,
  Node,
  Rect,
  Edge,
}
export default Shapes

