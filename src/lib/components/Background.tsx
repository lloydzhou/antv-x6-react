import React, { useEffect } from 'react';
/** Context */
import GraphContext from '../GraphContext';
import { mergeOption } from '../utils'

export interface BackgroundProps {
  enabled?: boolean;
  color?: string;
  image?: string;
  position?: {x: number, y: number};
  size?: {width: number, height: number};
  repeat?: boolean;
  opacity?: number;
  quality?: number;
  angle?: number;
}

const defaultOptions = {
  color: '#f5f5f5',
}

export const Background: React.FC<BackgroundProps> = (props) => {
  const { graph } = React.useContext(GraphContext);
  useEffect(() => {
    const options = mergeOption(defaultOptions, {...props, enabled: props.enabled !== false})
    graph.clearBackground()
    graph.drawBackground(options)
    return () => {
      graph.clearBackground()
    }
  }, [props, graph])
  return null
}

export default Background

