import React, { useEffect, useRef } from 'react';
import GraphContext from '../GraphContext';
import { mergeOption } from '../utils'

export interface MiniMapProps {
  enabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const defaultOptions = {
  enabled: true,
  width: 160,
  height: 120,
  padding: 10,
  scalable: false,
  minScale: 0.01,
  maxScale: 16,
  graphOptions: null,
}

export const MiniMap: React.FC<MiniMapProps> = (props) => {
  const { graph } = React.useContext(GraphContext);
  const { style, enabled, ...otherOptions } = props
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. 先停止监听
    if (graph.minimap.widget) {
      graph.minimap.widget.dispose()
    }
    // clear()
    // 2. 重新生成对应的widget（由于manager在graph上是readonly的只能更改内层的widget）
    const options = mergeOption(
      graph.options.minimap || {},
      mergeOption(
        {
          ...defaultOptions,
          graphOptions: { background: graph.options.background, grid: graph.options.grid },
        },
        {
          ...otherOptions,
          enabled: enabled !== false,
          container: containerRef.current,
        }
      )
    )
    graph.options.minimap = options
    graph.minimap.widget = graph.hook.createMiniMap()

    return () => {
      if (graph.minimap.widget) {
        graph.minimap.widget.dispose()
      }
    }
  }, [graph, enabled, otherOptions])

  return <div ref={containerRef} style={{
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    background: 'transparent',
    boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
    ...style
  }} />
}

export default MiniMap

