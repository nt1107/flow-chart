import * as type from './type';
import Container from './container';
import { EmitError, DeepCopy } from './helper';

class Graph {
  data: type.node[];
  renderData: type.renderNode[];
  containers: Container[];
  gap: type.gap;
  stringLen: number;
  fontSize: number;
  hook: Function | undefined;
  shapeMap: type.typeMap;
  lines: type.line[];
  nodeSet: Set<type.nodeId>;
  repeatMap: Map<type.nodeId, Map<type.nodeId, number>>;
  repeatNodes: Map<type.nodeId, type.nodeId>;
  nodeMap: Map<type.nodeId, type.node>;
  bbox: type.bbox;

  constructor(data: type.node[], shapeMap: type.typeMap) {
    this.data = data;
    this.renderData = [];
    this.stringLen = 15;
    this.fontSize = 8;
    this.gap = {
      vertical: 30,
      horizontal: 50
    };
    this.shapeMap = shapeMap;
    this.lines = [];
    this.nodeSet = new Set();
    this.repeatNodes = new Map();
    this.repeatMap = new Map();
    this.nodeMap = new Map();
    this.containers = [];
    this.preProcess(this.data);
    this.dealRepeat(this.data);
    this.setRepeatNodes();
    this.bbox = {
      x: [0, 0],
      y: [0, 0]
    };
  }

  preProcess(nodes: type.node[], fatherNode?: type.node) {
    nodes.forEach((node) => {
      if (fatherNode) node.fatherNode = fatherNode;
      if (this.nodeSet.has(node.id)) {
        if (this.repeatMap.size === 0) {
          this.signRepeat(this.nodeMap.get(node.id)!);
        }
        if (!this.repeatMap.has(node.id)) {
          this.repeatMap.set(node.id, new Map());
        }
        this.signRepeat(node);
        if (this.dealTriangle(node)) {
          this.nodeMap.set(node.id, node);
        }
      } else {
        this.nodeMap.set(node.id, node);
        this.nodeSet.add(node.id);
      }
      if (node.children) {
        this.preProcess(node.children, node);
      }
    });
  }

  dealTriangle(node: type.node) {
    const currentNode = node;
    const lastNode = this.nodeMap.get(node.id)!;

    let tag = currentNode;

    while (tag.fatherNode!.type !== 'container') {
      if (tag.fatherNode === lastNode?.fatherNode) {
        lastNode.triangle = true;
        this.signSingleNodeHide(currentNode);
        return false;
      }
      tag = tag.fatherNode!;
    }

    tag = lastNode;

    while (tag?.fatherNode?.type !== 'container') {
      if (tag.fatherNode === currentNode?.fatherNode) {
        currentNode.triangle = true;
        this.signSingleNodeHide(lastNode);
        return true;
      }
      tag = tag.fatherNode!;
    }
  }

  setRepeatNodes() {
    this.repeatMap.forEach((repeatMap, nodeId) => {
      let max = 0;
      let id: type.nodeId;
      repeatMap.forEach((number, grandeNodeId) => {
        if (number >= max) {
          max = number;
          id = grandeNodeId;
        }
      });
      this.repeatNodes.set(nodeId, id!);
    });
  }

  dealRepeat(nodes: type.node[]) {
    nodes.forEach((node) => {
      if (node.hasRepeatNode) {
        this.realignment(node.fatherNode!, node.repeatNodeId!);
        const repeatMap = this.repeatMap.get(node.repeatNodeId!);
        repeatMap!.set(
          node.fatherNode!.id,
          this.getMaxSuccessivRepeat(node.repeatNodeId!, node.fatherNode!)
        );
      }
    });

    nodes.forEach((node) => {
      if (node.children) {
        this.dealRepeat(node.children);
      }
    });
  }

  signRepeat(node: type.node) {
    const repeatNodeId = node.id;
    const grandNode = node.fatherNode!.fatherNode!;
    const fatherNodes = grandNode.children!;
    for (let i = 0; i < fatherNodes.length; i++) {
      const father = fatherNodes[i];
      if (
        father.children &&
        father.children.length === 1 &&
        father.children[0].id === repeatNodeId &&
        !father.children[0].hide
      ) {
        father.hasRepeatNode = true;
        father.repeatNodeId = node.id;
      }
    }
  }
  signSingleNodeHide(node: type.node) {
    const father = node.fatherNode!;
    if (father.hasRepeatNode && father.repeatNodeId === node.id) {
      father.hasRepeatNode = false;
      delete father.hasRepeatNode;
      delete father.repeatNodeId;
    }
    node.hide = true;
  }

  realignment(grandNode: type.node, repeatNodeId: type.nodeId) {
    if (grandNode.disallowChildrenRealignment) return;
    if (grandNode.type === 'container') return;
    let start = 0;
    const fatherNodes = grandNode.children!;
    let end = fatherNodes.length - 1;

    while (start < end) {
      while (fatherNodes[start].hasRepeatNode && start < end) {
        start++;
      }
      while (
        (!fatherNodes[end].hasRepeatNode ||
          fatherNodes[end].repeatNodeId !== repeatNodeId) &&
        start < end
      ) {
        end--;
      }
      [fatherNodes[start], fatherNodes[end]] = [
        fatherNodes[end],
        fatherNodes[start]
      ];
      start++;
      end--;
    }
  }

  getMaxSuccessivRepeat(nodeId: type.nodeId, grandNode: type.node) {
    let start = 0,
      end = 0;
    const fatherNodes = grandNode.children!;
    if (grandNode.disallowChildrenRealignment) {
      let max = 0;
      while (start < fatherNodes.length) {
        const res = this.calcSuccessivRepeat(start, end, nodeId, grandNode);
        start = res.start;
        end = res.end;
        max = Math.max(max, end - start);
        start = end;
      }
      return max;
    } else {
      const res = this.calcSuccessivRepeat(start, end, nodeId, grandNode);
      start = res.start;
      end = res.end;
      return end - start;
    }
  }

  calcSuccessivRepeat(
    start: number,
    end: number,
    nodeId: type.nodeId,
    grandNode: type.node
  ) {
    const fatherNodes = grandNode.children!;
    while (
      start < fatherNodes.length &&
      (!fatherNodes[start].hasRepeatNode ||
        fatherNodes[start].repeatNodeId !== nodeId)
    ) {
      start++;
    }
    end = start;
    while (
      end < fatherNodes.length &&
      fatherNodes[end].repeatNodeId === nodeId
    ) {
      end++;
    }
    return { start, end };
  }

  parse() {
    const baseOptions = {
      stringLen: this.stringLen,
      fontSize: this.fontSize,
      gap: this.gap,
      shapeMap: this.shapeMap,
      repeatNodes: this.repeatNodes,
      repeatMap: this.repeatMap
    };
    this.data.forEach((node: type.node) => {
      this.containers.push(new Container(node, this.lines, baseOptions));
    });
    if (this.data.length > 1) {
      this.setContainerPosition();
    }
    this.setRenderList();
    this.setLine();
    if (this.hook) {
      this.hook(this.renderData);
    }
    return this.renderData;
  }

  setContainerPosition() {
    const boundary: type.bbox = {
      x: [0, 0],
      y: [0, 0]
    };
    let xOffset = 0;
    this.containers.forEach((container, index) => {
      if (index > 0) {
        xOffset = boundary.x[1] + this.gap.horizontal * 3 - container.bbox.x[0];
        container.node.children?.forEach((node) => {
          node.x! += xOffset;
          node.children?.forEach((childNode) => {
            container.setPositionX(childNode);
          });
        });
      }
      DeepCopy(container.bbox, boundary);
    });
  }

  setRenderList() {
    this.data.forEach((node) => {
      this.addRenderData(node);
    });
  }

  addRenderData(node: type.node) {
    if (node.hide) return;
    const renderNode = {
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
    };
    this.renderData.push(renderNode);
    if (node.children?.length) {
      node.children.forEach((childNode) => this.addRenderData(childNode));
    }
  }

  beforeRender(callback: Function) {
    if (typeof callback !== 'function') {
      return EmitError('beforeRender must take a function as an argument ');
    }
    this.hook = callback;
  }

  setLine() {
    this.renderData.push(...this.lines);
  }
}

export default Graph;
