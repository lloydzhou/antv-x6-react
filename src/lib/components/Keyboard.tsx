import React, { useEffect } from 'react';
import { Graph } from '@antv/x6'
/** Context */
import GraphContext from '../GraphContext';

export interface KeyboardProps {
  enabled?: boolean;
  global?: boolean;
  format?: (key: string) => string;
  guard?: (graph: Graph, e: KeyboardEvent) => boolean;
}

// const defaultOptions = {
//   global: true,
// }

export const Keyboard: React.FC<KeyboardProps> = (props) => {
  const { graph } = React.useContext(GraphContext);
  const { enabled } = props
  useEffect(() => {
    // console.log('draw KEYBOARD', props)
    // TODO 暂时不能更新参数
    graph.disableKeyboard()
    if (enabled !== false) {
      graph.enableKeyboard()
    }

    return () => {
      graph.disableKeyboard()
    }
  }, [graph, enabled])
  return null
}

export default Keyboard

