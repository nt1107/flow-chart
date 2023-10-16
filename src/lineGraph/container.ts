import * as type from './type'
import * as Shape from './shape'
import { EmitError } from './helper'

class Container {
  node: type.node
  lines: type.line[]
  bbox: type.bbox
  gap: type.gap
  stringLen: number
  fontSize: number
  shapeMap: type.typeMap
  baseOptions: type.baseOptions
  repeatNodes: Map<type.nodeId, number>

  constructor(
    node: type.node,
    lines: type.line[],
    baseOptions: type.baseOptions
  ) {
    this.node = node
    this.baseOptions = baseOptions
    this.stringLen = baseOptions.stringLen
    this.fontSize = baseOptions.fontSize
    this.lines = lines
    this.bbox = {
      x: [0, 0],
      y: 0
    }
    this.gap = baseOptions.gap
    this.shapeMap = baseOptions.shapeMap
    this.repeatNodes = baseOptions.repeatNodes
    this.parse()
  }

  parse() {
    if (!this.node.children?.length) {
      EmitError('container node must contains at least one child node')
    }
    this.node.children!.forEach((childNode) => {
      childNode.parent = this.node.id
      childNode.isEvent = true
      this.parseNode(childNode, 'bottom', this.node)
    })
    this.addEventLine(this.node.children!)
    this.node.vheight = this.bbox.y
    this.node.vwidth = this.bbox.x
  }

  parseNode(
    node: type.node,
    direction: type.direction,
    fatherNode?: type.node
  ) {
    let strArray: string[] | [] = []
    let fontSize: number = node.style
      ? node.style['font-size']
        ? node.style['font-size']!
        : this.fontSize
      : this.fontSize

    if (node.label) {
      strArray = this.splitString(node.label)
    }
    let shapeSize = Shape[this.shapeMap[node.type]](
      strArray[0]?.length * fontSize,
      strArray[0]?.length * strArray.length
    )
    let nodeWidth = shapeSize.width
    let nodeHight = shapeSize.height
    let positionX = this.calcPositonX(direction, nodeWidth, fatherNode)

    this.setNodeProperty(
      node,
      nodeWidth,
      nodeHight,
      positionX,
      strArray,
      direction,
      fatherNode
    )

    this.setPositionY(node)
    this.dealRepeat(node, fatherNode as type.node)

    if (node.isEvent) {
      this.bbox.y = node.y! + node.vheight! / 2 + this.gap.vertical
    }
  }

  setChildrenPositionYPre(fatherNode: type.node) {
    if (fatherNode.left) this.setChildrenPositionY(fatherNode, fatherNode.left)
    if (fatherNode.right)
      this.setChildrenPositionY(fatherNode, fatherNode.right)
    if (!fatherNode.left && !fatherNode.right) {
      this.setChildrenPositionY(fatherNode)
    }
  }

  setChildrenPositionY(fatherNode: type.node, childrenNodes?: type.node[]) {
    childrenNodes = childrenNodes
      ? childrenNodes
      : (fatherNode.children as type.node[])

    let restHeight = Math.max(fatherNode.childrenVheight!, fatherNode.height!)
    let halfHeight = restHeight / 2
    let len = childrenNodes.length
    let baseY = fatherNode.y!

    if (len === 1) {
      childrenNodes[0].y = baseY
      if (childrenNodes[0].children) {
        this.setChildrenPositionYPre(childrenNodes[0])
      }
    } else {
      let extraGap = (restHeight - fatherNode.childrenVheight!) / (len - 1)
      if (
        childrenNodes.findIndex((childNode) => childNode.hasRepeatNode) > -1
      ) {
        this.adjustRepeatNodes(
          childrenNodes,
          fatherNode,
          baseY,
          halfHeight,
          restHeight,
          extraGap
        )
      } else {
        for (let index = childrenNodes.length - 1; index >= 0; index--) {
          let childNode = childrenNodes[index]
          childNode.y = baseY + restHeight - halfHeight - childNode.vheight! / 2
          if (childNode.children) {
            this.setChildrenPositionYPre(childNode)
          }
          restHeight -= childNode.vheight!
          if (index > 0) {
            restHeight -= this.gap.vertical + extraGap
          }
        }
      }
    }
  }

  dealRepeat(node: type.node, fatherNode: type.node) {
    if (this.repeatNodes.has(node.id)) {
      if (!this.determineIsRepeat(node, fatherNode as type.node)) {
        this.repeatNodes.delete(node.id)
      } else {
        let restNum = this.repeatNodes.get(node.id)!
        if (restNum > 1) {
          this.repeatNodes.set(node.id, --restNum)
        } else {
          node.fatherNode!.hasRepeatNode = true
        }
      }
    }
  }

  determineIsRepeat(node: type.node, fatherNode: type.node) {
    let repeatNodeId = node.id
    let grandNode = fatherNode.fatherNode

    return grandNode?.children?.every((father) => {
      return (
        father.children?.length === 1 && father.children[0].id === repeatNodeId
      )
    })
  }

  adjustRepeatNodes(
    childrenNodes: type.node[],
    fatherNode: type.node,
    baseY: number,
    halfHeight: number,
    restHeight: number,
    extraGap: number
  ) {
    let len = childrenNodes.length
    let maxBoundary = 0
    childrenNodes.forEach((childNode, index) => {
      childNode.y = baseY + restHeight - halfHeight - childNode.vheight! / 2
      maxBoundary = Math.max(maxBoundary, childNode.x! + childNode.width! / 2)
      if (index === len - 1) {
        let repeatNode = childNode.children![0]
        repeatNode.y = fatherNode.y
        this.setPositionX(repeatNode, maxBoundary)
        if (repeatNode.children) {
          this.setChildrenPositionYPre(repeatNode)
        }
      } else {
        delete childNode.children
      }
      restHeight -= childNode.vheight!
      if (index < len - 1) {
        restHeight -= this.gap.vertical + extraGap
      }
    })
  }

  setPositionX(node: type.node, boundary?: number) {
    let nodeWidth = node.width!
    if (node.type === 'container') {
      if (node.direction === 'left') {
        nodeWidth = node.vwidth![1] - node.x!
      } else if (node.direction === 'right') {
        nodeWidth = node.x! - node.vwidth![0]
      }
    }
    if (node.direction === 'bottom') {
      node.x = node.fatherNode!.x!
    } else if (node.direction === 'left') {
      boundary = boundary
        ? boundary
        : node.fatherNode!.x! - node.fatherNode!.width! / 2

      node.x = boundary - this.gap.horizontal - nodeWidth / 2
    } else {
      boundary = boundary
        ? boundary
        : node.fatherNode!.x! + node.fatherNode!.width! / 2

      node.x = boundary + this.gap.horizontal + nodeWidth / 2
    }
    if (node.children) {
      node.children.forEach((nodeChild) => {
        this.setPositionX(nodeChild)
      })
    }
  }

  setNodeProperty(
    node: type.node,
    width: number,
    height: number,
    x: number,
    label: string[],
    direction: type.direction,
    fatherNode?: type.node
  ) {
    node.height = height
    node.vheight = height
    node.width = width
    node.x = x
    node.label = label.join('\n')
    node.direction = direction
    node.fatherNode = fatherNode
  }

  getChildrenVheight(childrenNodes: type.node[]) {
    let sumHeight = 0
    if (childrenNodes.findIndex((childNode) => childNode.hasRepeatNode) > -1) {
      childrenNodes.forEach((childNode) => {
        sumHeight += childNode.height!
      })
      sumHeight += this.gap.vertical * (childrenNodes.length - 1)
      sumHeight = Math.max(sumHeight, childrenNodes[0].vheight!)
    } else {
      childrenNodes.forEach((childNode) => {
        sumHeight += childNode.vheight!
      })
      sumHeight += this.gap.vertical * (childrenNodes.length - 1)
    }
    return sumHeight
  }

  calcPositonX(
    direction: type.direction,
    nodeWidth: number,
    fatherNode?: type.node
  ) {
    const fatherX = fatherNode?.x || 0
    const fatherWidth = fatherNode?.width ? fatherNode.width / 2 : 0

    if (direction === 'bottom') {
      return fatherX
    } else if (direction === 'left') {
      const x = fatherX - fatherWidth / 2 - nodeWidth / 2 - this.gap.horizontal
      this.bbox.x[0] = Math.min(this.bbox.x[0], x - nodeWidth / 2)
      return x
    } else if (direction === 'right') {
      const x = fatherX + fatherWidth / 2 + nodeWidth / 2 + this.gap.horizontal
      this.bbox.x[1] = Math.max(this.bbox.x[1], x + nodeWidth / 2)
      return x
    } else {
      return 0
    }
  }

  setPositionY(node: type.node) {
    let nodeHight = node.height!
    if (node.children?.length) {
      if (node?.type === 'container') {
        new Container(node, this.lines, this.baseOptions)
        this.setPositionX(node)
      } else {
        node.children.forEach((childNode: type.node, index: number) => {
          this.addLine(node, childNode)
          let childDirection: type.direction
          childNode.parent = node.parent
          if (node.isEvent) {
            if (index % 2 === 0) {
              childDirection = 'left'
              node.left = node.left || []
              node.left.push(childNode)
            } else {
              childDirection = 'right'
              node.right = node.right || []
              node.right.push(childNode)
            }
          } else {
            childDirection = node.direction!
          }
          this.parseNode(childNode, childDirection, node)
        })
      }
      if (node.isEvent) {
        this.mergeLeftRightPositionY(node)
      } else {
        let chilrenVheight = this.getChildrenVheight(node.children)
        node.vheight = Math.max(nodeHight, chilrenVheight)
        node.childrenVheight = chilrenVheight
        node.y = this.bbox.y + node.vheight / 2
        this.setChildrenPositionYPre(node)
      }
    } else {
      node.y = this.bbox.y + nodeHight / 2
    }
  }
  addEventLine(childNodes: type.node[]) {
    if (childNodes.length <= 1) return
    for (let i = 1; i < childNodes.length; i++) {
      this.addLine(childNodes[i - 1], childNodes[i], '顺承')
    }
  }
  addLine(sourceNode: type.node, targetNode: type.node, label = '') {
    this.lines.push({
      data: {
        source: sourceNode.id,
        target: targetNode.id
      },
      style: {
        label
      }
    })
  }

  mergeLeftRightPositionY(node: type.node) {
    if (!node.children) return
    let leftVheight = 0,
      rightVheight = 0
    if (node.left) {
      leftVheight = this.getChildrenVheight(node.left)
    }
    if (node.right) {
      rightVheight = this.getChildrenVheight(node.right)
    }
    let chilrenVheight = Math.max(leftVheight, rightVheight)
    node.vheight = Math.max(node.height!, chilrenVheight)
    node.childrenVheight = chilrenVheight
    node.y = this.bbox.y + node.vheight / 2
    if (node.children) this.setChildrenPositionYPre(node)
  }

  splitString(label: string) {
    let str = []
    for (let i = 0; i < label.length; i++) {
      str.push(label.slice(i, i + this.stringLen + 1))
      i += this.stringLen
    }
    return str
  }
}

export default Container
