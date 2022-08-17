// @ts-nocheck
import React, { useEffect } from 'react';
/** Context */
import GraphContext from '../GraphContext';

import { mergeOption } from '../utils'

export interface GridProps {
  type?: string;
  args?: any;
  visible?: boolean;
  size?: number;
}

const defaultOptions = {
  size: 10,
  visible: true,
  type: 'dot',
  args: {
    color: '#a0a0a0',
    thickness: 1,
  }
}

export const Grid: React.FC<GridProps> = (props) => {
  const { graph } = React.useContext(GraphContext);
  useEffect(() => {
    const options = mergeOption(defaultOptions, {...props})
    console.log('options', options)
    graph.hideGrid()
    graph.drawGrid(options)
    return () => graph.clearGrid()
  }, [props, graph])
  return null
}

export default Grid

