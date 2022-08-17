import React, { useEffect } from 'react';
import { Graph, Cell } from '@antv/x6'
/** Context */
import GraphContext from '../GraphContext';

type Callback = (e: {cells: Cell[], graph: Graph}) => void;
export interface ClipboardProps {
  enabled?: boolean;
  onCopy?: Callback;
  onCut?: Callback;
  onPaste?: Callback;
}

export const Clipboard: React.FC<ClipboardProps> = (props) => {
  const { graph } = React.useContext(GraphContext);
  const { enabled, onCopy, onCut, onPaste } = props
  const copy = () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.copy(cells)
      onCopy && onCopy({ cells, graph })
    }
  }
  const cut = () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.cut(cells)
      onCut && onCut({ cells, graph })
    }
  }
  const paste = () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 })
      graph.cleanSelection()
      graph.select(cells)
      onPaste && onPaste({ cells, graph })
    }
  }
  useEffect(() => {
    graph.disableClipboard()
    if (enabled !== false) {
      graph.enableClipboard()
    }
    graph.bindKey('ctrl+c', copy)
    graph.bindKey('ctrl+x', cut)
    graph.bindKey('ctrl+v', paste)
    return () => {
      graph.disableClipboard()
      graph.unbindKey('ctrl+c')
      graph.unbindKey('ctrl+x')
      graph.unbindKey('ctrl+v')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, graph])
  return null
}

export default Clipboard

