import React, { useEffect } from 'react';
/** Context */
import GraphContext from '../GraphContext';
import { mergeOption } from '../utils'

export interface SelectionProps {
  enabled?: boolean;
  onSelected?: (e: any) => void
  onUnSelected?: (e: any) => void
  onChanged?: (e: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const defaultOptions = {
  multiple: true,
  multipleSelectionModifiers: ['ctrl', 'meta'],
  rubberband: true,
  showNodeSelectionBox: true,
  modifiers: 'shift',
}

export const Selection: React.FC<SelectionProps> = (props) => {
  const { graph } = React.useContext(GraphContext);
  const { onSelected, onUnSelected, onChanged, ...otherProps } = props
  const selected = (e: any) => onSelected && onSelected(e)
  const unselected = (e: any) => onUnSelected && onUnSelected(e)
  const changed = (e: any) => onChanged && onChanged(e)

  useEffect(() => {
    // 1. 先停止监听
    // clear()
    // 2. 重新生成对应的widget（由于manager在graph上是readonly的只能更改内层的widget）
    const { enabled, ...otherOptions } = otherProps
    const selecting = mergeOption(
      // @ts-ignore
      graph.selection?.widgetOptions || {},
      mergeOption(
        defaultOptions,
        {
          ...otherOptions,
          enabled: enabled !== false,
        }
      )
    )
    // 从那边获取的值是{0: 'ctrl', 1: 'meta'}不是一个Array
    if (selecting.multiple && !selecting.multipleSelectionModifiers.length) {
      selecting.multipleSelectionModifiers = ['ctrl', 'meta']
    }
    graph.options.selecting = selecting
    graph.selection.widget = graph.hook.createSelection()
    graph.enableSelection()
    graph.selection.enable()
    graph.on('cell:selected', selected)
    graph.on('cell:unselected', unselected)
    graph.on('selection:changed', changed)

    return () => {
      graph.cleanSelection()
      graph.disableSelection()
      graph.off('cell:selected', selected)
      graph.off('cell:unselected', unselected)
      graph.off('selection:changed', changed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph])

  return null
}

export default Selection

