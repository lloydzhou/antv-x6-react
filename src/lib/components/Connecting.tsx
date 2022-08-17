import React, { useEffect, useRef } from 'react';
/** Context */
import GraphContext from '../GraphContext';
import { mergeOption } from '../utils'

const defaultOptions = {
  snap: { radius: 40 },
  dangling: true,
  allowMulti: true,
  allowBlank: true,

  allowLoop: true,
  allowNode: true,
  allowEdge: false,
  allowPort: true,
  highlight: false,

  anchor: 'center',
  edgeAnchor: 'ratio',
  connectionPoint: 'boundary',
  strategy: null,
  router: 'normal',
  connector: 'normal',

  validateConnection: () => true,
  validateEdge: () => true,
}

export const Connecting: React.FC<{[key: string]: any}> = (props) => {
  const { graph } = React.useContext(GraphContext);
  const options = useRef<{[key: string]: any}>({})
  useEffect(() => {
    options.current = {...graph.options.connecting}
    const newOptions = mergeOption(defaultOptions, {...props, enabled: props.enabled !== false})
    mergeOption(newOptions, graph.options.connecting)
    return () => {
      // 直接恢复之前的旧的配置
      mergeOption(options.current, graph.options.connecting)
    }
  }, [props, graph])
  return null
}

export default Connecting

