import React, { useEffect } from 'react';
/** Context */
import GraphContext from '../GraphContext';
import { mergeOption } from '../utils'

export interface SnaplineProps {
  enabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const defaultOptions = {
  tolerance: 10,
}

export const Snapline: React.FC<SnaplineProps> = (props) => {
  const { graph } = React.useContext(GraphContext);
  useEffect(() => {
    graph.disableSnapline()
    const options = mergeOption(defaultOptions, {...props, enabled: props.enabled !== false})
    mergeOption(options, graph.snapline.widget.options)
    graph.enableSnapline()
    return () => {
      graph.disableSnapline()
    }
  }, [props, graph])
  return null
}

export default Snapline

