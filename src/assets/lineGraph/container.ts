import * as type from './type';
import * as Shape from './shape';
import { EmitError } from './helper';

class Container {
  node: type.node;
  lines: type.line[];
  bbox: type.bbox;
  gap: type.gap;
  stringLen: number;
  fontSize: number;
  shapeMap: type.typeMap;
  baseOptions: type.baseOptions;
  containers: Container[];
  repeatNodes: Map<type.nodeId, type.nodeId>;
  repeatMap: Map<type.nodeId, Map<type.nodeId, number>>;

  constructor(
    node: type.node,
    lines: type.line[],
    baseOptions: type.baseOptions
  ) {
    this.node = node;
    this.baseOptions = baseOptions;
    this.stringLen = baseOptions.stringLen;
    this.fontSize = baseOptions.fontSize;
    this.lines = lines;
    this.containers = [];
    this.bbox = {
      x: [Infinity, -Infinity],
      y: [0, 0]
    };
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
    this.node.children!.forEach((childNode) => {
      childNode.parent = this.node.id;
      childNode.isEvent = true;
      this.parseNode(childNode, 'bottom');
    });
    this.addEventLine(this.node.children!);
    this.node.vheight = this.bbox.y[1];
    this.node.vwidth = this.bbox.x;
  }

  parseNode(node: type.node, direction: type.direction) {
    let strArray: string[] | [] = [];
    const fontSize: number = node.style
      ? node.style['font-size']
        ? node.style['font-size']!
        : this.fontSize
      : this.fontSize;

    if (node.label) {
      strArray = this.splitString(node.label);
    }
    const shapeSize = Shape[this.shapeMap[node.type]](
      strArray[0]?.length * fontSize,
      strArray[0]?.length * strArray.length
    );
    const nodeWidth = shapeSize.width;
    const nodeHight = shapeSize.height;
    const positionX = this.calcPositonX(direction, nodeWidth, node.fatherNode!);

    this.setNodeProperty(
      node,
      nodeWidth,
      nodeHight,
      positionX,
      strArray,
      direction
    );

    this.setPositionY(node);

    if (node.isEvent) {
      this.bbox.y[1] = node.y! + node.vheight! / 2 + this.gap.vertical;
    }
  }

  setChildrenPositionYPre(fatherNode: type.node) {
    if (fatherNode.left) this.setChildrenPositionY(fatherNode, fatherNode.left);
    if (fatherNode.right)
      this.setChildrenPositionY(fatherNode, fatherNode.right);
    if (!fatherNode.left && !fatherNode.right) {
      this.setChildrenPositionY(fatherNode);
    }
  }

  setChildrenPositionY(fatherNode: type.node, childrenNodes?: type.node[]) {
    childrenNodes = childrenNodes ? childrenNodes : fatherNode.children!;

    const restHeight = Math.max(
      fatherNode.childrenVheight!,
      fatherNode.height!
    );
    let len = 0;
    const baseY = fatherNode.y!;

    childrenNodes.forEach((childNode) => {
      if (!childNode.hide) len++;
    });
    if (len === 0) return;
    if (len === 1) {
      childrenNodes.forEach((childNode) => {
        if (!childNode.hide && childNode.y !== baseY) {
          childNode.y = baseY;
          if (childNode.children) {
            this.setChildrenPositionYPre(childNode);
          }
        }
      });
    } else {
      const extraGap = (restHeight - fatherNode.childrenVheight!) / (len - 1);
      if (
        childrenNodes.findIndex((childNode) => childNode.hasRepeatNode) > -1
      ) {
        // if (fatherNode.id === 70) debugger;
        this.adjustRepeatNodes(childrenNodes, baseY, restHeight, extraGap);
      } else {
        this.calcPositionY(childrenNodes, baseY, restHeight, extraGap);
      }
    }
  }

  calcPositionY(
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
      if (childNode.hasRepeatNode && childNode.children![0].y !== baseY) {
        childNode.children![0].y = baseY;
        if (childNode.children![0].children) {
          this.setChildrenPositionYPre(childNode.children![0]);
        }
      } else {
        if (childNode.children) {
          this.setChildrenPositionYPre(childNode);
        }
      }
      restHeight -= childNode.vheight!;
      if (index < nodes.length - 1) {
        restHeight -= this.gap.vertical + extraGap;
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
          if (childrenNodes[end].children) {
            this.setChildrenPositionYPre(childrenNodes[end]);
          }
          start = ++end;
        } else {
          // 前面有一组重复节点需要先排掉
          accHeight = Math.max(accHeight, childrenNodes[start].vheight!);
          this.calcPositionY(
            childrenNodes.slice(start, end),
            Yboundary + accHeight / 2,
            accHeight,
            extraGap
          );
          this.setPositionX(childrenNodes[end - 1].children![0], XBoundary);
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
          this.calcPositionY(
            childrenNodes.slice(start, end),
            Yboundary + accHeight / 2,
            accHeight,
            extraGap
          );
          this.setPositionX(childrenNodes[end - 1].children![0], XBoundary);
        }
        continue;
      } else if (repeatNodeId === childrenNodes[end].repeatNodeId) {
        // 继续遇到重复节点
        XBoundary = this.calcXBoundary(childrenNodes[end], XBoundary);
        accHeight += childrenNodes[end].height! + this.gap.vertical + extraGap;
        ++end;
        if (end === childrenNodes.length) {
          accHeight = Math.max(accHeight, childrenNodes[start].vheight!);
          this.calcPositionY(
            childrenNodes.slice(start, end),
            Yboundary + accHeight / 2,
            accHeight,
            extraGap
          );
          this.setPositionX(childrenNodes[end - 1].children![0], XBoundary);
        }
        continue;
      } else {
        // 遇到的是新的一组重复节点
        accHeight = Math.max(accHeight, childrenNodes[start].vheight!);
        this.calcPositionY(
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

  setPositionX(node: type.node, boundary?: number) {
    let nodeWidth = node.width!;
    if (node.type === 'container') {
      if (node.direction === 'left') {
        nodeWidth = (node.vwidth![1] - node.x!) * 2;
      } else if (node.direction === 'right') {
        nodeWidth = (node.x! - node.vwidth![0]) * 2;
      }
    }
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
      this.bbox.x[1] = Math.max(this.bbox.x[0], node.x + nodeWidth / 2);
    }
    if (node.children) {
      node.children.forEach((nodeChild) => {
        if (!nodeChild.hide) {
          this.setPositionX(nodeChild);
        }
      });
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
    node.height = height;
    node.vheight = height;
    node.width = width;
    node.x = x;
    node.label = label.join('\n');
    node.direction = direction;
    this.bbox.x[0] = Math.min(this.bbox.x[0], x - width / 2);
    this.bbox.x[1] = Math.max(this.bbox.x[1], x + width / 2);
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

  calcPositonX(
    direction: type.direction,
    nodeWidth: number,
    fatherNode?: type.node
  ) {
    const fatherX = fatherNode?.x || 0;
    const fatherWidth = fatherNode?.width ? fatherNode.width : 0;

    if (direction === 'bottom') {
      return fatherX;
    } else if (direction === 'left') {
      const x = fatherX - fatherWidth / 2 - nodeWidth / 2 - this.gap.horizontal;
      this.bbox.x[0] = Math.min(this.bbox.x[0], x - nodeWidth / 2);
      return x;
    } else if (direction === 'right') {
      const x = fatherX + fatherWidth / 2 + nodeWidth / 2 + this.gap.horizontal;
      this.bbox.x[1] = Math.max(this.bbox.x[1], x + nodeWidth / 2);
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

  setPositionY(node: type.node) {
    const nodeHight = node.height!;
    if (node.children?.length) {
      if (node?.type === 'container') {
        const container = new Container(node, this.lines, this.baseOptions);
        this.containers.push(container);
        container.setPositionX(node);
        this.bbox.x[0] = Math.min(this.bbox.x[0], container.bbox.x[0]);
        this.bbox.x[1] = Math.max(this.bbox.x[1], container.bbox.x[1]);
      } else {
        node.children.forEach((childNode: type.node, index: number) => {
          this.addLine(node, childNode);
          if (!childNode.hide) {
            if (this.dealRepeatHide(node, childNode)) return;
            let childDirection: type.direction;
            childNode.parent = node.parent;
            if (node.isEvent) {
              if (index % 2 === 0) {
                childDirection = 'left';
                node.left = node.left || [];
                node.left.push(childNode);
              } else {
                childDirection = 'right';
                node.right = node.right || [];
                node.right.push(childNode);
              }
            } else {
              childDirection = node.direction!;
            }
            this.parseNode(childNode, childDirection);
          }
        });
      }
      if (node.isEvent) {
        this.mergeLeftRightPositionY(node);
      } else {
        const chilrenVheight = this.getChildrenVheight(node.children);
        node.vheight = Math.max(nodeHight, chilrenVheight);
        node.childrenVheight = chilrenVheight;
        const newY = this.bbox.y[1] + node.vheight / 2;
        if (newY !== node.y) {
          node.y = newY;
          this.setChildrenPositionYPre(node);
        }
      }
    } else {
      node.y = this.bbox.y[1] + nodeHight / 2;
    }
  }
  addEventLine(childNodes: type.node[]) {
    if (childNodes.length <= 1) return;
    for (let i = 1; i < childNodes.length; i++) {
      this.addLine(childNodes[i - 1], childNodes[i], '顺承');
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
    });
  }

  mergeLeftRightPositionY(node: type.node) {
    if (!node.children) return;
    let leftVheight = 0,
      rightVheight = 0;
    if (node.left) {
      leftVheight = this.getChildrenVheight(node.left);
    }
    if (node.right) {
      rightVheight = this.getChildrenVheight(node.right);
    }
    const chilrenVheight = Math.max(leftVheight, rightVheight);
    node.vheight = Math.max(node.height!, chilrenVheight);
    node.childrenVheight = chilrenVheight;
    const newY = this.bbox.y[1] + node.vheight / 2;
    if (newY !== node.y) {
      node.y = newY;
      if (node.children) this.setChildrenPositionYPre(node);
    }
  }

  splitString(label: string) {
    const str = [];
    for (let i = 0; i < label.length; i++) {
      str.push(label.slice(i, i + this.stringLen + 1));
      i += this.stringLen;
    }
    return str;
  }
}

export default Container;
