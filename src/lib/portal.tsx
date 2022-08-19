// from https://github.com/antvis/X6/blob/master/packages/x6-react-shape/src/portal.ts
import React from 'react';
import ReactDOM from 'react-dom'
import { Dom } from '@antv/x6'

export namespace Portal {
  let active = false
  let dispatch: React.Dispatch<Action>

  interface Action {
    type: 'add' | 'remove'
    payload: Partial<Payload>
  }

  interface Payload {
    id: string
    portal: React.ReactPortal
  }

  const reducer = (state: Payload[], action: Action) => {
    const payload = action.payload as Payload
    switch (action.type) {
      case 'add': {
        const index = state.findIndex((item) => item.id === payload.id)
        if (index >= 0) {
          state[index] = payload
          return [...state]
        }
        return [...state, payload]
      }
      case 'remove': {
        const index = state.findIndex((item) => item.id === payload.id)
        if (index >= 0) {
          const result = [...state]
          result.splice(index, 1)
          return result
        }
        break
      }
      default: {
        break
      }
    }
    return state
  }

  export function connect(id: string, portal: React.ReactPortal) {
    if (active) {
      dispatch({ type: 'add', payload: { id, portal } })
    }
  }

  export function disconnect(id: string) {
    if (active) {
      dispatch({ type: 'remove', payload: { id } })
    }
  }

  export function isActive() {
    return active
  }

  export function wrap(ComponentClass: React.ElementType) {

    return {
      mount: async (props: any) => {
        const { graph, node, container } = props
        const id = `${graph.view.cid}:${node.id}`
        Dom.requestAnimationFrame(() => {
          if (active) {
            // 如果Portal组件已经挂载，就使用portal，否则使用原始ReactDOM.render
            // 这里使用graph.view.id做前缀
            connect(id, ReactDOM.createPortal(<ComponentClass {...props} id={id} />, container))
          } else {
            ReactDOM.render(<ComponentClass {...props} id={id} />, container)
          }
        })
      },
      unmount: async (props: any) => {
        const { graph, node, container } = props
        if (active) {
          // 如果Portal组件挂载过就从portals列表里面移除，否则使用ReactDOM移除
          const id = `${graph.view.cid}:${node.id}`
          disconnect(id)
        } else {
          ReactDOM.unmountComponentAtNode(container)
        }
      }
    }
  }

  export function getProvider() {
    // eslint-disable-next-line react/display-name
    return () => {
      active = true
      const [items, mutate] = React.useReducer(reducer, [])
      dispatch = mutate
      // eslint-disable-next-line react/no-children-prop
      return React.createElement(React.Fragment, {
        children: items.map((item) => item.portal),
      })
    }
  }
}

