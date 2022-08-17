/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const defaultContext = {
  graph: {} as any,
};
export interface GraphContextType {
  graph: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const GraphContext: React.Context<GraphContextType> = React.createContext(defaultContext);

export default GraphContext;

const defaultCellContext = {
  cell: null as any,
};
export interface CellContextType {
  cell: any;
}

export const CellContext: React.Context<CellContextType> = React.createContext(defaultCellContext);

