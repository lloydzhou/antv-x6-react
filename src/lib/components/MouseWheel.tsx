// @ts-nocheck
import React, { useEffect } from 'react';
/** Context */
import GraphContext from '../GraphContext';
import { mergeOption } from '../utils'

export interface MouseWheelProps {
  enabled?: boolean;
  global?: boolean;
  factor?: number;
  zoomAtMousePosition?: boolean;
  modifiers?: string;
  guard?: (graph: Graph, e: KeyboardEvent) => boolean;
}

const defaultOptions = {
  modifiers: 'ctrl',
}

export const MouseWheel: React.FC<MouseWheelProps> = (props) => {
  const { graph } = React.useContext(GraphContext);
  useEffect(() => {
    graph.disableMouseWheel()
    const { enabled, ...otherOptions } = props
    const mousewheel = mergeOption(
      graph.options.mousewheel || {},
      mergeOption(
        defaultOptions,
        {
          ...otherOptions,
          enabled: enabled !== false
        }
      )
    )
    graph.options.mousewheel = mousewheel
    graph.enableMouseWheel()

    return () => graph.disableMouseWheel()
  }, [props, graph])
  return null
}

export default MouseWheel

