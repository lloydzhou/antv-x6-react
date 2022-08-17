import React, { useEffect } from 'react';
/** Context */
import GraphContext from '../GraphContext';
import { mergeOption } from '../utils'

export interface ScrollerProps {
  enabled?: boolean;
  pannable?: boolean;
  autoResize?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const defaultOptions = {
  pannable: true,
  autoResize: true,
}

export const Scroller: React.FC<ScrollerProps> = (props) => {
  const { graph } = React.useContext(GraphContext);
  useEffect(() => {
    const { enabled, ...otherOptions } = props
    // 1. 先停止监听
    if (graph.scroller.widget) {
      graph.scroller.widget.dispose()
    }
    // 2. 重新生成对应的widget（由于manager在graph上是readonly的只能更改内层的widget）
    const scroller = mergeOption(
      graph.options.scroller || {},
      mergeOption(
        defaultOptions,
        {
          ...otherOptions,
          enabled: enabled !== false
        }
      )
    )
    graph.options.scroller = scroller
    graph.scroller.widget = graph.hook.createScroller()
    graph.drawGrid(graph.options.grid)
    
    const options = mergeOption(defaultOptions, {...props, enabled: props.enabled !== false})
    graph.clearBackground()
    graph.drawBackground(options)
    return () => {
      if (graph.scroller.widget) {
        graph.scroller.widget.dispose()
      }
    }
  }, [props, graph])
  return null
}

export default Scroller

