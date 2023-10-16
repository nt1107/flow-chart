import * as type from './type'
import Container from './container'

class Graph {
  data: type.node[]
  renderData: type.renderNode[]
  gap: type.gap
  stringLen: number
  fontSize: number
  hook: Function | undefined
  shapeMap: type.typeMap
  lines: type.line[]
  nodeSet: Set<type.nodeId>
  repeatNodes: Map<type.nodeId, number>

  constructor(data: type.node[], shapeMap: type.typeMap) {
    this.data = data
    this.renderData = []
    this.stringLen = 15
    this.fontSize = 8
    this.gap = {
      vertical: 30,
      horizontal: 50
    }
    this.shapeMap = shapeMap
    this.lines = []
    this.nodeSet = new Set()
    this.repeatNodes = new Map()
    this.preProcess(this.data)
  }

  preProcess(nodes: type.node[]) {
    nodes.forEach((node) => {
      if (this.nodeSet.has(node.id)) {
        if (this.repeatNodes.has(node.id)) {
          let repeatNumber = this.repeatNodes.get(node.id) as number
          this.repeatNodes.set(node.id, ++repeatNumber)
        } else {
          this.repeatNodes.set(node.id, 2)
        }
      } else {
        this.nodeSet.add(node.id)
      }
      if (node.children) {
        this.preProcess(node.children)
      }
    })
  }

  parse() {
    const baseOptions = {
      stringLen: this.stringLen,
      fontSize: this.fontSize,
      gap: this.gap,
      shapeMap: this.shapeMap,
      repeatNodes: this.repeatNodes
    }
    this.data.forEach((node: type.node) => {
      new Container(node, this.lines, baseOptions)
    })
    this.setRenderList()
    this.setLine()
    if (this.hook) {
      this.hook(this.renderData)
    }
    return this.renderData
  }

  setRenderList() {
    this.data.forEach((node) => {
      this.addRenderData(node)
    })
  }

  addRenderData(node: type.node) {
    let renderNode = {
      data: {
        id: node.id,
        type: node.type,
        parent: node.parent
      },
      position: {
        x: node.x as number,
        y: node.y as number
      },
      style: {
        width: node.width as number,
        height: node.height as number,
        label: node.label as string,
        'font-size': node.style?.['font-size'] as number,
        ...node.style
      }
    }
    this.renderData.push(renderNode)
    if (node.children?.length) {
      node.children.forEach((childNode) => this.addRenderData(childNode))
    }
  }

  beforeRender(callback: Function) {
    if (typeof callback !== 'function') {
      callback = function () {}
    }
    this.hook = callback
  }

  setLine() {
    this.renderData.push(...this.lines)
  }

  update() {}
}

export default Graph
