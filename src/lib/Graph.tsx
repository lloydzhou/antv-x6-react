// @ts-nocheck
import React, { useState, useRef, Fragment, useEffect } from 'react';
import * as X6 from '@antv/x6'
/** Context */
import GraphContext, { GraphContextType } from './GraphContext';

export interface GraphProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  autoResize?: boolean;
  panning?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const Graph: React.FC<GraphProps> = (props) => {
  const [context, setContext] = useState<GraphContextType>({})
  const graphDOM = useRef<HTMLDivElement>()
  const isReady = useRef<boolean>(false)

  const { width, height, autoResize, panning, children, ...otherOptions } = props
  useEffect(() => {
    const { clientWidth, clientHeight } = graphDOM.current
    const rwidth = Number(width) || clientWidth || 500;
    const rheight = Number(height) || clientHeight || 500;
    const options = {
      container: graphDOM.current,
      width: rwidth,
      height: rheight,
      autoResize: autoResize !== false,
      panning: panning !== false,
      ...otherOptions,
    }
    const graph = new X6.Graph(options)
    setContext({ graph, cell: null })
    isReady.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <GraphContext.Provider value={context}>
      <div id="graph-contaner" style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}>
        <div data-testid="custom-element" className="graph-core" style={{
          width: '100%',
          height: '100%',
        }} ref={node => graphDOM.current = node} />
        <div className="graph-component">
          {isReady.current && <Fragment>
            {children}
          </Fragment>}
        </div>
      </div>
    </GraphContext.Provider>
  )
}

export default Graph
