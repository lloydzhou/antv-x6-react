// @ts-nocheck
import React, { useEffect } from 'react';
/** Context */
import GraphContext from '../GraphContext';

export interface ClipboardProps {
  enabled?: boolean;
}

export const Clipboard: React.FC<ClipboardProps> = (props) => {
  const { graph } = React.useContext(GraphContext);
  const { enabled } = props
  const copy = () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.copy(cells)
      emit('copy', { cells, graph })
    }
  }
  const cut = () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.cut(cells)
      emit('cut', { cells, graph })
    }
  }
  const paste = () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 })
      graph.cleanSelection()
      graph.select(cells)
      emit('paste', { cells, graph })
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
      graph.unbindKey('ctrl+c', copy)
      graph.unbindKey('ctrl+x', cut)
      graph.unbindKey('ctrl+v', paste)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, graph])
  return null
}

export default Clipboard

