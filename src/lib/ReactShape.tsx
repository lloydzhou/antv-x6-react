// @ts-nocheck
import React from 'react';
import GraphContext, { CellContext } from './GraphContext';
import 'antv-x6-html2'
import { useCell } from './Shape'
import { Portal } from './portal'
import { addListener, removeListener } from "resize-detector";
import { debounce } from './utils'

const ReactNode: React.FC<{[key: string]: any}> = (props) => {
  const { children, component, primer='rect', autoResize, nodeRef, ...otherProps } = props

  // 使用一个内部的组件包裹一下，自动监听data变化
  const ComponentClass = component ? component : () => children
  const DataWatcher: React.FC<{[key: string]: any}> = (props) => {
    const { node } = props
    const [data, setData] = React.useState(node.getData())
    const root = React.useRef<HTMLDivElement>()
    React.useEffect(() => {
      node.on('change:data', () => {
        setData(node.getData())
      })
      if (autoResize !== false && root.current && node.model && node.model.graph.view.cid === graph.view.cid) {
        const resizeListener = debounce((e) => {
          const { width, height } = getComputedStyle(e)
          node.size({width: parseFloat(width), height: parseFloat(height)})
        })
        resizeListener(root.current)
        addListener(root.current, resizeListener)
        return () => {
          removeListener(root.current, resizeListener)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
      <div className="react-shape" ref={node => root.current = node}>
        <ComponentClass {...props} data={data} />
      </div>
    )
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
