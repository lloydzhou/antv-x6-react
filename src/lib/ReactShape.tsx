// @ts-nocheck
import React from 'react';
import { CellContext } from './GraphContext';
import 'antv-x6-html2'
import { useCell } from './Shape'
import { Portal } from './portal'


export const useNodeSize = (props) => {
  const { node, graph } = props
  const { width: w, height: h } = node.getSize()
  const [width, setWidth] = React.useState(w)
  const [height, setHeight] = React.useState(h)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const view = graph.findViewByCell(node)
    console.log('node', node, 'view', view)
    if (view) {
      const container = view.selectors.foContent
      if (container && container.firstChild) {
        const { width, height } = container.firstChild.getBoundingClientRect()
        // 这里使用useState，会自动判断是否变化
        setWidth(width)
        setHeight(height)
      }
    }
  })
  React.useEffect(() => {
    node.size({width, height})
  }, [width, height, node])
  return null
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

export default ReactNode
