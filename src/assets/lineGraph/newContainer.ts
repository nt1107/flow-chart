import * as type from './type';
import type Graph from './index';
import { ShapeType } from './Shape/type';
import { EmitError } from './helper';
import { pure, Helper } from './help/containerHelper';

class Container {
  node: type.node;
  lines: type.line[];
  bbox: type.bbox;
  gap: type.gap;
  stringLen: number;
  fontSize: number;
  shapeMap: type.typeMap;
  baseOptions: type.baseOptions;
  repeatNodes: Map<type.nodeId, type.nodeId>;
  repeatMap: Map<type.nodeId, Map<type.nodeId, number>>;
  shape: ShapeType;
  graph: Graph;

  constructor(
    node: type.node,
    lines: type.line[],
    baseOptions: type.baseOptions
  ) {
    this.node = node;
    this.baseOptions = baseOptions;
    this.stringLen = baseOptions.stringLen;
    this.fontSize = baseOptions.fontSize;
    this.graph = baseOptions.graph;
    this.lines = lines;
    this.bbox = {
      x: [Infinity, -Infinity],
      y: [0, 0]
    };
    this.shape = baseOptions.shape;
    this.gap = baseOptions.gap;
    this.shapeMap = baseOptions.shapeMap;
    this.repeatNodes = baseOptions.repeatNodes;
    this.repeatMap = baseOptions.repeatMap;
    this.parse();
  }

  parse() {
    if (!this.node.children?.length) {
      return EmitError('container node must contains at least one child node');
    }
    this.parseNode(this.node);
    this.addEventLine(this.node.children!);
    this.node.vheight = this.bbox.y[1];
  }

  parseNode(node: type.node, direction?: type.direction) {
    if (!node.fatherNode) {
      node.isRoot = true;
    } else if (node.fatherNode.type === 'container') {
      node.isEvent = true;
    }

    if (!direction) {
      direction = this.calcNodeDirtion(node);
    }

    let strArray: string[] | [] = [];
    const fontSize: number = node.style
      ? node.style['font-size'] || this.fontSize
      : this.fontSize;

    if (node.label) {
      strArray = pure.splitString(node.label, this.stringLen);
    }
    const calcFunc = pure.getCalcFunc(this.shape, this.shapeMap, node.type)!;
    const shapeSize = calcFunc(
      strArray[0]?.length * fontSize,
      strArray[0]?.length * strArray.length
    );
    const nodeWidth = shapeSize.width;
    const nodeHight = shapeSize.height;
    const positionX = this.calcX(direction, nodeWidth, node.fatherNode!);

    this.setNodeProperty(
      node,
      nodeWidth,
      nodeHight,
      positionX,
      strArray,
      direction
    );
    if (node.type === 'container') {
      node.y = this.bbox.y[0];
    }
  }

  setNodeProperty(
    node: type.node,
    width: number,
    height: number,
    x: number,
    label: string[],
    direction: type.direction
  ) {
    this.reactive(node);
    node.height = height;
    node.vheight = height;
    node.width = width;
    node.label = label.join('\n');
    node.direction = direction;
    if (!node.isRoot) {
      node.parent = node.isEvent
        ? node.fatherNode!.id
        : node.fatherNode!.parent;
    }
    node.container = this;
    node.x = x;
  }

  reactive(node: type.node) {
    let oldX = node.x;
    const that = this;
    Object.defineProperty(node, 'x', {
      set(value: number) {
        if (value === oldX) return;
        oldX = value;
        if (that.graph.isEdit) {
          that.graph.editNodes.add(node);
        }
        if (that.graph.process === 'render' && that.graph.mode === 'render') {
          that.setBboxX(node);
        } else if (
          that.graph.process === 'render' &&
          that.graph.mode === 'adjustX'
        ) {
          that.setBboxX(node);
          that.setChildrenX(node);
        }
      },
      get() {
        return oldX;
      }
    });
    let oldY = node.y;
    Object.defineProperty(node, 'y', {
      set(value: number) {
        if (oldY === value) return;
        oldY = value;
        if (that.graph.isEdit) {
          that.graph.editNodes.add(node);
        }
        if (that.graph.process === 'render' && that.graph.mode === 'render') {
          that.setY(node);
          if (node.isEvent) {
            that.bbox.y[1] = value + node.vheight! / 2 + that.gap.vertical;
          }
        } else if (
          that.graph.process === 'render' &&
          that.graph.mode === 'adjustY'
        ) {
          that.setChildrenYPre(node);
        }
      },
      get() {
        return oldY;
      }
    });
  }

  setY(node: type.node) {
    const nodeHight = node.height!;
    if (node.children?.length) {
      node.children.forEach((childNode: type.node, index: number) => {
        if (node.type !== 'container') {
          this.addLine(node, childNode);
        }
        if (childNode?.type === 'container' && !childNode.isRoot) {
          const container = new Container(
            childNode,
            this.lines,
            this.baseOptions
          );
          Helper.runWidthModeChange(
            this.graph,
            this,
            'adjustX',
            this.setChildrenContainerX,
            [container]
          );
        } else {
          if (!childNode.hide) {
            if (this.dealRepeatHide(node, childNode)) return;
            let childDirection: type.direction;
            if (node.isEvent) {
              childDirection = this.eventNodeAddChild(childNode, index);
            } else {
              childDirection = node.direction!;
            }
            this.parseNode(childNode, childDirection);
            childNode.y = node.y;
          }
        }
      });

      let childrenVheight;
      if (node.isEvent) {
        childrenVheight = this.mergeLeftRightVheight(node);
      } else {
        childrenVheight = this.getChildrenVheight(node.children);
      }
      node.vheight = Math.max(nodeHight, childrenVheight!);
      node.childrenVheight = childrenVheight;

      if (node.isRoot) {
        Helper.runWidthModeChange(
          this.graph,
          this,
          'adjustY',
          this.setChildrenYPre,
          [node]
        );
      }
    }
  }

  setChildrenYPre(fatherNode: type.node) {
    if (fatherNode.left) this.setChildrenY(fatherNode, fatherNode.left);
    if (fatherNode.right) this.setChildrenY(fatherNode, fatherNode.right);
    if (!fatherNode.left && !fatherNode.right && fatherNode.children) {
      this.setChildrenY(fatherNode);
    }
  }

  setChildrenY(fatherNode: type.node, childrenNodes?: type.node[]) {
    childrenNodes = childrenNodes ? childrenNodes : fatherNode.children!;

    const restHeight = fatherNode.vheight!;
    let len = 0;
    const baseY = fatherNode.y!;
    childrenNodes.forEach((childNode) => {
      if (!childNode.hide) len++;
    });
    if (len === 0) return;
    if (len === 1) {
      childrenNodes.forEach((childNode) => {
        if (!childNode.hide) {
          childNode.y = baseY;
        }
      });
    } else {
      const extraGap = (restHeight - fatherNode.childrenVheight!) / (len - 1);
      if (
        childrenNodes.findIndex((childNode) => childNode.hasRepeatNode) > -1
      ) {
        this.adjustRepeatNodes(childrenNodes, baseY, restHeight, extraGap);
      } else {
        this.calcY(childrenNodes, baseY, restHeight, extraGap);
      }
    }
  }

  adjustRepeatNodes(
    childrenNodes: type.node[],
    baseY: number,
    restHeight: number,
    extraGap: number
  ) {
    let XBoundary = 0;
    const halfHeight = restHeight / 2;
    let Yboundary = baseY - halfHeight;
    let start = 0;
    let end = start;
    let repeatNodeId;
    let accHeight = 0;

    while (end < childrenNodes.length) {
      // 如果是隐藏元素
      if (childrenNodes[end].hide) {
        ++end;
        continue;
      }
      // 不包含重复节点的时候
      if (!childrenNodes[end].hasRepeatNode) {
        if (accHeight === 0) {
          // 正常排
          childrenNodes[end].y =
            baseY - restHeight + halfHeight + childrenNodes[end].vheight! / 2;
          Yboundary =
            childrenNodes[end].y! +
            childrenNodes[end].vheight! / 2 +
            this.gap.vertical +
            extraGap;
          restHeight -= childrenNodes[end].vheight!;
          start = ++end;
        } else {
          // 前面有一组重复节点需要先排掉
          accHeight = Math.max(accHeight, childrenNodes[start].vheight!);
          this.calcY(
            childrenNodes.slice(start, end),
            Yboundary + accHeight / 2,
            accHeight,
            extraGap
          );
          Helper.runWidthModeChange(this.graph, this, 'adjustX', this.setX, [
            childrenNodes[end - 1].children![0],
            XBoundary
          ]);
          Yboundary += accHeight + extraGap;
          XBoundary = 0;
          restHeight -= accHeight;
          accHeight = 0;
          repeatNodeId = undefined;
        }
      } else if (repeatNodeId === undefined) {
        // 开始遇到重复节点
        repeatNodeId = childrenNodes[end].repeatNodeId;
        accHeight += childrenNodes[end].height!;
        XBoundary = this.calcXBoundary(childrenNodes[end], XBoundary);
        ++end;
        if (end === childrenNodes.length) {
          accHeight = Math.max(accHeight, childrenNodes[start].vheight!);
          this.calcY(
            childrenNodes.slice(start, end),
            Yboundary + accHeight / 2,
            accHeight,
            extraGap
          );
          Helper.runWidthModeChange(this.graph, this, 'adjustX', this.setX, [
            childrenNodes[end - 1].children![0],
            XBoundary
          ]);
        }
        continue;
      } else if (repeatNodeId === childrenNodes[end].repeatNodeId) {
        // 继续遇到重复节点
        XBoundary = this.calcXBoundary(childrenNodes[end], XBoundary);
        accHeight += childrenNodes[end].height! + this.gap.vertical + extraGap;
        ++end;
        if (end === childrenNodes.length) {
          accHeight = Math.max(accHeight, childrenNodes[start].vheight!);
          this.calcY(
            childrenNodes.slice(start, end),
            Yboundary + accHeight / 2,
            accHeight,
            extraGap
          );
          Helper.runWidthModeChange(this.graph, this, 'adjustX', this.setX, [
            childrenNodes[end - 1].children![0],
            XBoundary
          ]);
        }
        continue;
      } else {
        // 遇到的是新的一组重复节点
        accHeight = Math.max(accHeight, childrenNodes[start].vheight!);
        this.calcY(
          childrenNodes.slice(start, end),
          Yboundary + accHeight / 2,
          accHeight,
          extraGap
        );
        Yboundary += accHeight + extraGap + this.gap.vertical;
        restHeight -= accHeight;
        start = end;
        accHeight = 0;
        XBoundary = 0;
        repeatNodeId = undefined;
      }

      if (end < childrenNodes.length) {
        restHeight -= this.gap.vertical + extraGap;
      }
    }
  }

  calcY(
    nodes: type.node[],
    baseY: number,
    restHeight: number,
    extraGap: number
  ) {
    const halfHeight = restHeight / 2;
    for (let index = 0; index < nodes.length; index++) {
      const childNode = nodes[index];
      if (childNode.hide) continue;
      childNode.y = baseY - restHeight + halfHeight + childNode.vheight! / 2;
      if (
        childNode.hasRepeatNode &&
        childNode.children![0].y !== baseY &&
        !childNode.children![0].hide
      ) {
        childNode.children![0].y = baseY;
      }
      restHeight -= childNode.vheight!;
      if (index < nodes.length - 1) {
        restHeight -= this.gap.vertical + extraGap;
      }
    }
  }

  setChildrenX(node: type.node) {
    if (node.hide) return;
    if (node.children) {
      node.children.forEach((nodeChild) => {
        if (!nodeChild.hide) {
          if (nodeChild.type === 'container') {
            const container = nodeChild.container!;
            this.setChildrenContainerX(container);
          } else {
            this.setX(nodeChild);
          }
        }
      });
    }
  }

  setX(node: type.node, boundary?: number) {
    const nodeWidth = node.width!;
    if (node.direction === 'bottom') {
      node.x = node.fatherNode!.x!;
    } else if (node.direction === 'left') {
      boundary = boundary
        ? boundary
        : node.fatherNode!.x! - node.fatherNode!.width! / 2;

      node.x = boundary - this.gap.horizontal - nodeWidth / 2;
      this.bbox.x[0] = Math.min(this.bbox.x[0], node.x - nodeWidth / 2);
    } else {
      boundary = boundary
        ? boundary
        : node.fatherNode!.x! + node.fatherNode!.width! / 2;

      node.x = boundary + this.gap.horizontal + nodeWidth / 2;
      this.bbox.x[1] = Math.max(this.bbox.x[1], node.x + nodeWidth / 2);
    }
  }

  setChildrenContainerX(container: Container) {
    const fatherNode = container.node.fatherNode!;
    if (container.node.direction === 'right') {
      const boundary =
        fatherNode.x! + fatherNode.width! / 2 + this.gap.horizontal;
      if (boundary! === container.bbox.x[0]) {
        const xOffset = boundary - this.bbox.x[0];
        container.node.x! += xOffset;
        container.bbox.x[0] += xOffset;
        container.bbox.x[1] += xOffset;
        this.bbox.x[1] = Math.max(this.bbox.x[1], container.bbox.x[1]);
      }
    } else if (container.node.direction === 'left') {
      const boundary =
        fatherNode.x! - fatherNode.width! / 2 - this.gap.horizontal;
      if (boundary! === container.bbox.x[1]) {
        const xOffset = boundary - this.bbox.x[0];
        container.node.x! += xOffset;
        container.bbox.x[0] += xOffset;
        container.bbox.x[1] += xOffset;
        this.bbox.x[0] = Math.min(this.bbox.x[0], container.bbox.x[0]);
      }
    }
  }

  setNodeHide(fatherNode: type.node, nodeId: type.nodeId) {
    fatherNode.children!.forEach((node) => {
      if (node.id === nodeId) node.hide = true;
    });
  }

  dealRepeatHide(fatherNode: type.node, node: type.node) {
    if (!this.repeatNodes.has(node.id)) return false;
    if (node.triangle) return false;
    const grandNode = fatherNode.fatherNode!;
    if (
      grandNode.id !== this.repeatNodes.get(node.id) ||
      !fatherNode.hasRepeatNode ||
      fatherNode.repeatNodeId !== node.id
    ) {
      this.setNodeHide(fatherNode, node.id);
      return true;
    }
    const repeatMap = this.repeatMap.get(node.id);
    if (repeatMap!.get(grandNode.id) === 1) {
      node.fatherNode!.hasRepeatNode = false;
    }
  }

  getChildrenVheight(childrenNodes: type.node[]) {
    let sumHeight = 0;
    let len = 0;
    if (childrenNodes.findIndex((childNode) => childNode.hasRepeatNode) > -1) {
      let index = 0;
      let repeatNodeId;
      let accHeight = 0;
      let repeatNodeVheight = 0;
      while (index < childrenNodes.length) {
        if (childrenNodes[index].hide) {
          ++index;
          continue;
        }
        if (!childrenNodes[index].hasRepeatNode) {
          // 正常点
          if (accHeight > 0) {
            // 加一下
            if (sumHeight > 0) sumHeight += this.gap.vertical;
            sumHeight += Math.max(
              Math.max(accHeight, repeatNodeVheight),
              childrenNodes[index - 1].vheight!
            );
            accHeight = 0;
            repeatNodeVheight = 0;
          }

          sumHeight += childrenNodes[index].vheight!;
          if (index > 0) sumHeight += this.gap.vertical;
          index++;
        } else if (repeatNodeId === undefined) {
          // 开始遇到重复
          repeatNodeId = childrenNodes[index].repeatNodeId;
          accHeight += childrenNodes[index].height!;
          repeatNodeVheight = childrenNodes[index]!.vheight!;
          if (index > 0) sumHeight += this.gap.vertical;
          index++;
          if (index === childrenNodes.length) {
            sumHeight += childrenNodes[index - 1].vheight!;
          }
        } else if (childrenNodes[index].repeatNodeId === repeatNodeId) {
          // 继续遇到重复
          accHeight += childrenNodes[index].height! + this.gap.vertical;
          index++;
          if (index === childrenNodes.length) {
            sumHeight += Math.max(accHeight, childrenNodes[index - 1].vheight!);
          }
        } else {
          // 遇到新的重复, 先加一下
          sumHeight += Math.max(
            Math.max(accHeight, repeatNodeVheight),
            childrenNodes[index - 1].vheight!
          );
          repeatNodeId = undefined;
          accHeight = 0;
          repeatNodeVheight = 0;
        }
      }
    } else {
      childrenNodes.forEach((childNode) => {
        if (!childNode.hide) {
          sumHeight += childNode.vheight!;
          len++;
        }
      });
      sumHeight += this.gap.vertical * (len - 1);
    }

    return sumHeight;
  }

  setBboxX(node: type.node) {
    const direction = node.direction;
    if (direction === 'bottom') {
      this.bbox.x[0] = Math.min(this.bbox.x[0], node.x! - node.width! / 2);
      this.bbox.x[1] = Math.max(this.bbox.x[1], node.x! + node.width! / 2);
    } else if (direction === 'left') {
      this.bbox.x[0] = Math.min(this.bbox.x[0], node.x! - node.width! / 2);
    } else if (direction === 'right') {
      this.bbox.x[1] = Math.max(this.bbox.x[1], node.x! + node.width! / 2);
    }
  }

  calcX(direction: type.direction, nodeWidth: number, fatherNode?: type.node) {
    const fatherX = fatherNode?.x || 0;
    const fatherWidth = fatherNode?.width ? fatherNode.width : 0;

    if (direction === 'bottom') {
      return fatherX;
    } else if (direction === 'left') {
      const x = fatherX - fatherWidth / 2 - nodeWidth / 2 - this.gap.horizontal;
      return x;
    } else if (direction === 'right') {
      const x = fatherX + fatherWidth / 2 + nodeWidth / 2 + this.gap.horizontal;
      return x;
    } else {
      return 0;
    }
  }

  calcXBoundary(node: type.node, XBoundary: number) {
    if (node.direction === 'left') {
      XBoundary = Math.min(XBoundary, node.x! - node.width! / 2);
    } else if (node.direction === 'right') {
      XBoundary = Math.max(XBoundary, node.x! + node.width! / 2);
    }
    return XBoundary;
  }

  eventNodeAddChild(node: type.node, index?: number) {
    const fatherNode = node.fatherNode!;
    index = index === undefined ? fatherNode.children!.length - 1 : index;
    let direction: type.direction;
    if (index % 2 === 0) {
      direction = 'left';
      fatherNode.left = fatherNode.left || [];
      fatherNode.left.push(node);
    } else {
      direction = 'right';
      fatherNode.right = fatherNode.right || [];
      fatherNode.right.push(node);
    }
    return direction;
  }

  calcNodeDirtion(node: type.node, index?: number) {
    const fatherNode = node.fatherNode;
    let direction: type.direction = 'bottom';
    if (fatherNode) {
      index = index === undefined ? fatherNode.children!.length - 1 : index;
      if (fatherNode.type === 'container') {
        direction = 'bottom';
      } else if (fatherNode.isEvent) {
        if (index % 2 === 0) {
          direction = 'left';
        } else {
          direction = 'right';
        }
      } else {
        direction = fatherNode.direction!;
      }
    } else {
      direction = 'bottom';
    }
    return direction;
  }

  addEventLine(childNodes: type.node[]) {
    if (childNodes.length <= 1) return;
    for (let i = 1; i < childNodes.length; i++) {
      this.addLine(childNodes[i - 1], childNodes[i]);
    }
  }
  addLine(sourceNode: type.node, targetNode: type.node) {
    this.lines.push({
      data: {
        source: sourceNode.id,
        target: targetNode.id
      },
      style: {
        label: targetNode.lineLabel
      }
    });
  }

  // addNode(node: type.node, fatherNode: type.node) {
  //   if (!fatherNode.children) {
  //     fatherNode.children = [];
  //   }
  //   fatherNode.children.push(node);
  //   node.fatherNode = fatherNode;
  //   let direction: type.direction;
  //   if (fatherNode.type === 'container') {
  //     direction = 'bottom';
  //     node.parent = fatherNode.id;
  //   } else if (fatherNode.isEvent) {
  //     direction = this.eventNodeAddChild(node);
  //     node.parent = fatherNode.parent;
  //   } else {
  //     direction = fatherNode.direction!;
  //     node.parent = fatherNode.parent;
  //   }
  //   let parentContainer = this as Container;
  //   while (parentContainer.node.parent !== undefined) {
  //     parentContainer = parentContainer.node.fatherNode!.container!;
  //   }

  //   const bboxXCache = [...parentContainer.bbox.x] as type.bbox['x'];
  //   this.parseNode(node, direction);
  //   this.setParentPositionY(node);
  //   this.addLine(fatherNode, node);
  //   this.setNeighborContainerPositonX(bboxXCache);
  //   this.update(node);
  // }

  // setNeighborContainerPositonX(bboxXCache: type.bbox['x']) {
  //   let parentContainer = this as Container;
  //   while (parentContainer.node.parent !== undefined) {
  //     parentContainer = parentContainer.node.fatherNode!.container!;
  //   }
  //   if (parentContainer.bbox.x[0] < bboxXCache[0]) {
  //     this.graph.setContainerPosition('left', parentContainer);
  //   }
  //   if (parentContainer.bbox.x[1] > bboxXCache[1]) {
  //     this.graph.setContainerPosition('right', parentContainer);
  //   }
  // }

  // adjustParentContainerPositionX(node: type.node) {
  //   if (node.type !== 'container') return;
  //   if (!node.fatherNode) return;
  //   const parentContainer = node.fatherNode.container!;
  //   if (node.direction === 'bottom') {
  //     return;
  //   } else if (node.direction === 'right') {
  //     const boundary =
  //       node.fatherNode.x! + this.gap.horizontal + node.fatherNode.width! / 2;
  //     if (
  //       boundary !== this.bbox.x[0] ||
  //       this.bbox.x[1] > parentContainer.bbox.x[1]
  //     ) {
  //       const xOffset = boundary - this.bbox.x[0];
  //       this.bbox.x[0] += xOffset;
  //       this.bbox.x[1] += xOffset;
  //       parentContainer.bbox.x[1] = Math.max(
  //         this.bbox.x[1],
  //         parentContainer.bbox.x[1]
  //       );
  //       this.setContainerPositionX(xOffset);
  //       this.graph.setContainerPosition('right', parentContainer);
  //     }
  //   } else {
  //     const boundary =
  //       node.fatherNode.x! - this.gap.horizontal - node.fatherNode.width! / 2;
  //     if (
  //       boundary !== this.bbox.x[1] ||
  //       this.bbox.x[0] < parentContainer.bbox.x[0]
  //     ) {
  //       const xOffset = boundary - this.bbox.x[1];
  //       this.bbox.x[1] += xOffset;
  //       this.bbox.x[0] += xOffset;
  //       parentContainer.bbox.x[0] = Math.min(
  //         this.bbox.x[0],
  //         parentContainer.bbox.x[0]
  //       );
  //       this.setContainerPositionX(xOffset);
  //       this.graph.setContainerPosition('left', parentContainer);
  //     }
  //   }
  // }

  // setContainerPositionX(Xoffset: number) {
  //   this.node.children?.forEach((node) => {
  //     node.x! += Xoffset;
  //     if (this.graph.isEdit) {
  //       this.graph.editNodes.add(node);
  //     }
  //     node.children?.forEach((childNode) => {
  //       this.setPositionX(childNode);
  //     });
  //   });
  // }

  // setParentPositionY(node: type.node) {
  //   const fatherNode = node.fatherNode!;
  //   let childrenVheight;
  //   if (fatherNode.isEvent) {
  //     childrenVheight = this.mergeLeftRightVheight(fatherNode);
  //   } else {
  //     childrenVheight = this.getChildrenVheight(fatherNode.children!);
  //   }
  //   if (
  //     fatherNode.children!.length > 1 ||
  //     node.vheight! > fatherNode.vheight! ||
  //     node.isEvent
  //   ) {
  //     if (node.isEvent) {
  //       const index = this.node.children!.findIndex(
  //         (eventNode) => eventNode.id === node.id
  //       );
  //       this.adjustEventNodePostionY(index);
  //       if (node.fatherNode!.parent !== undefined) {
  //         this.adjustParentContainerPositionX(node.fatherNode!);
  //       }
  //     } else {
  //       fatherNode.vheight = Math.max(childrenVheight!, fatherNode.vheight!);
  //       this.setParentPositionY(fatherNode);
  //     }
  //   } else {
  //     this.setChildrenPositionYPre(node);
  //   }
  // }

  // adjustEventNodePostionY(index: number) {
  //   if (index === this.node.children!.length) return;
  //   if (index === 0) return;
  //   const lastEventNode = this.node.children![index - 1];
  //   const boundary =
  //     lastEventNode.y! + lastEventNode.vheight! / 2 + this.gap.vertical;
  //   const currentEventNode = this.node.children![index];
  //   if (currentEventNode.y! !== boundary + currentEventNode.vheight! / 2) {
  //     currentEventNode.y = boundary + currentEventNode.vheight! / 2;
  //     this.graph.editNodes.add(currentEventNode);
  //     this.setChildrenPositionYPre(currentEventNode);
  //     this.adjustEventNodePostionY(index + 1);
  //   }
  // }

  mergeLeftRightVheight(node: type.node) {
    if (!node.children) return;
    let leftVheight = 0,
      rightVheight = 0;
    if (node.left) {
      leftVheight = this.getChildrenVheight(node.left);
    }
    if (node.right) {
      rightVheight = this.getChildrenVheight(node.right);
    }
    return Math.max(leftVheight, rightVheight);
  }

  // update(node: type.node) {
  //   const newLine = this.lines[this.lines.length - 1];
  //   const newNode = this.graph.addRenderData(node);
  //   if (this.graph.hook) {
  //     this.graph.hook([newNode, newLine]);
  //   }
  //   this.graph.setLine(newLine);
  //   this.graph.cyRender!.add(newNode!);
  //   this.graph.cyRender!.add(newLine);
  //   this.graph.cyRender!.updateNodes(this.graph.editNodes);
  // }
}

export default Container;
