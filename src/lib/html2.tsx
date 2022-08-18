// @ts-nocheck
import { Shape, Markup, NodeView, Dom, ObjectExt, FunctionExt } from '@antv/x6'

export namespace HTML2 {

  export class View extends NodeView {
    protected init() {
      super.init()
      Dom.requestAnimationFrame(() => this.mount())
    }
  
    mount() {
      const container = this.selectors.foContent
      if (container) {
        this.getSingleSPAComponentHook('mount').then((mount) => {
          FunctionExt.call(mount, this, {
            graph: this.graph,
            node: this.cell,
            container: container as Element,
          }).then((component: any) => {
            if (component) {
              const $wrap = this.$(container).empty()
              if (typeof component === 'string') {
                $wrap.html(component)
              } else {
                $wrap.append(component)
              }
            }
          })
        })
      }
    }
  
    unmount(elem: Element) {
      this.getSingleSPAComponentHook('unmount').then((unmount) => {
        const container = this.selectors.foContent
        FunctionExt.call(unmount, this, {
          graph: this.graph,
          node: this.cell,
          container: container as Element,
        })
      })
      super.unmount(elem)
      return this
    }
  
    protected getSingleSPAComponentHook(name: 'mount' | 'unmount') {
      return Promise.resolve().then(() => {
        const html = this.cell.getHTML()
        if (ObjectExt.isPlainObject(html)) {
          const hook = (html as HTML.SingleSPAComponent)[name]
          if (typeof hook === 'function') {
            return hook
          }
        }
        // eslint-disable-next-line
        return Promise.reject('can not get hook')
      })
    }
  }
  
  NodeView.registry.register('html2-view', View, true)
  
  export class Node extends Shape.HTML {}
  
  function getMarkup(primer = 'rect') {
    return [
      {
        tagName: primer,
        selector: 'body',
      },
      Markup.getForeignObjectMarkup(),
      {
        tagName: 'text',
        selector: 'label',
      },
    ]
  }
  
  Node.config({
    view: 'html2-view',
    markup: getMarkup('rect'),
    attrs: {
      body: {
        fill: 'none',
        stroke: 'none',
        refWidth: '100%',
        refHeight: '100%',
      },
      fo: {
        refWidth: '100%',
        refHeight: '100%',
      },
      label: {
        fontSize: 14,
        fill: '#333',
        refX: '50%',
        refY: '50%',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
    },
    propHooks(metadata: Properties) {
      if (metadata.markup == null) {
        const primer = metadata.primer
        if (primer && primer !== 'rect') {
          metadata.markup = getMarkup(primer)
          let attrs = {}
          if (primer === 'circle') {
            attrs = {
              refCx: '50%',
              refCy: '50%',
              refR: '50%',
            }
          } else if (primer === 'ellipse') {
            attrs = {
              refCx: '50%',
              refCy: '50%',
              refRx: '50%',
              refRy: '50%',
            }
          }
          metadata.attrs = ObjectExt.merge(
            {},
            {
              body: {
                refWidth: null,
                refHeight: null,
                ...attrs,
              },
            },
            metadata.attrs || {},
          )
        }
      }
      return metadata
    }
  })
  
  Node.registry.register('html2', Node, true)
}
