/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Graph } from '@antv/x6';

const defaultContext = {
  graph: {} as Graph,
};
export interface GraphContextType {
  graph: Graph;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const GraphContext: React.Context<GraphContextType> = React.createContext(defaultContext);

export default GraphContext;

const defaultCellContext = {
  cell: null,
};
export interface CellContextType {
  cell: any;
}

export const CellContext: React.Context<CellContextType> = React.createContext(defaultCellContext);

const defaultContextMenuContext = {
  x: 0,
  y: 0,
  item: null,
  view: null,
  visible: false,
  onShow: null,
  onClose: () => {},
};
export interface ContextMenuType {
  x: number;
  y: number;
  item: any;
  view: any;
  visible: boolean;
  onShow: any;
  onClose: () => void;
}

export const ContextMenuContext: React.Context<ContextMenuType> = React.createContext(defaultContextMenuContext);



