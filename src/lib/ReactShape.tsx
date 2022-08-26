// @ts-nocheck
import React from 'react';
import GraphContext, { CellContext } from './GraphContext';
import 'antv-x6-html2'
import { useCell } from './Shape'
import { Portal } from './portal'
import { addListener, removeListener } from "resize-detector";
import { debounce } from './utils'


export const useNodeSize = (props) => {
  const { node, graph } = props
  const resizeListener = debounce((e) => {
    const { width, height } = e.getBoundingClientRect()
    node.size({width, height})
  })
  React.useEffect(() => {
    const view = graph.findViewByCell(node)
    if (view) {
      const container = view.selectors.foContent
      if (container && container.firstChild) {
        const root = container.firstChild
        resizeListener(root)
        addListener(root, resizeListener)
        return () => {
          removeListener(root, resizeListener)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

const ReactNode: React.FC<{[key: string]: any}> = (props) => {
  const { children, component, primer='rect', nodeRef, ...otherProps } = props

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
  const [cell, context] = useCell({
    ...otherProps,
    shape: 'html2',
    primer,
    // 使用Portal.wrap包裹一层变成mount + unmount模式
    // 自动按照是否挂载PortalProvider自动选择是否使用Portal模式
    html: Portal.wrap(DataWatcher),
  })
  const { graph } = React.useContext(GraphContext)
  React.useImperativeHandle(nodeRef, () => ({node: cell.current, graph}))
  return cell.current ? <CellContext.Provider value={context}>
    {component && children}
  </CellContext.Provider> : null
}

export default ReactNode
