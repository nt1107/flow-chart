import * as type from './type';
import type cytoscape from 'cytoscape';
import * as shapeType from './Shape/type';
import preProcess from './preProcess';
import Shape from './Shape/shape';
import Container from './container';
import { EmitError, DeepCopy } from './helper';
import cyRender from './cyRender';

class Graph {
  data: type.node[];
  renderData: type.renderNode[];
  containers: Container[];
  gap: type.gap;
  stringLen: number;
  fontSize: number;
  hook: Function | undefined;
  shape: Shape;
  shapeMap: type.typeMap;
  lines: type.line[];
  nodeSet: Set<type.nodeId>;
  repeatMap: Map<type.nodeId, Map<type.nodeId, number>>;
  repeatNodes: Map<type.nodeId, type.nodeId>;
  nodeMap: Map<type.nodeId, type.node>;
  bbox: type.bbox;
  isEdit: Boolean;
  editNodes: Set<type.node>;
  cyRender?: cyRender;

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
    this.shape = new Shape();
    this.nodeSet = new Set();
    this.repeatNodes = new Map();
    this.repeatMap = new Map();
    this.nodeMap = new Map();
    this.containers = [];
    this.isEdit = false;
    this.editNodes = new Set();
    this.bbox = {
      x: [0, 0],
      y: [0, 0]
    };
    this.preProcess();
  }

  addNode(node: type.node, fatherNodeId?: type.nodeId) {
    if (this.nodeSet.has(node.id)) return EmitError('This node already exists');
    this.isEdit = true;
    this.nodeSet.add(node.id);
    if (fatherNodeId) {
      let fatherNode;
      for (let i = 0; i < this.containers.length; i++) {
        const currentNode = this.containers[i].node;
        fatherNode = this.findNode(currentNode, fatherNodeId);
        if (fatherNode) return fatherNode.container!.addNode(node, fatherNode);
      }
      if (!fatherNode) {
        this.nodeSet.delete(node.id);
        return EmitError('The specified node does not exist');
      }
    }
  }

  findNode(currentNode: type.node, nodeId: type.nodeId): type.node | false {
    if (currentNode.id === nodeId && !currentNode.hide) {
      return currentNode;
    } else if (currentNode.children?.length) {
      for (let i = 0; i < currentNode.children.length; i++) {
        const res = this.findNode(currentNode.children[i], nodeId);
        if (res) return res;
      }
      return false;
    } else {
      return false;
    }
  }

  preProcess() {
    new preProcess(
      this.data,
      this.nodeSet,
      this.repeatMap,
      this.nodeMap,
      this.repeatNodes
    );
  }

  parse() {
    const baseOptions = {
      stringLen: this.stringLen,
      fontSize: this.fontSize,
      gap: this.gap,
      shapeMap: this.shapeMap,
      repeatNodes: this.repeatNodes,
      repeatMap: this.repeatMap,
      shape: this.shape,
      graph: this
    };
    this.data.forEach((node: type.node) => {
      this.containers.push(new Container(node, this.lines, baseOptions));
    });
    if (this.data.length > 1) {
      this.setContainerPosition('right', this.containers[0]);
    }

    this.setRenderList();
    this.setLine();
    if (this.hook) {
      this.hook(this.renderData);
    }
    return this.renderData;
  }

  setContainerPosition(direction: 'left' | 'right', baseContainer: Container) {
    const boundary: type.bbox = {
      x: [0, 0],
      y: [0, 0]
    };
    let xOffset = 0;
    let index = this.containers.findIndex(
      (container) => container === baseContainer
    );
    if (index < 0) return;
    let container: Container;
    DeepCopy(baseContainer.bbox, boundary);

    if (direction === 'right') {
      while (++index < this.containers.length) {
        container = this.containers[index];
        xOffset = boundary.x[1] + this.gap.horizontal * 3 - container.bbox.x[0];
        if (xOffset === 0) break;
        container.bbox.x[0] += xOffset;
        container.bbox.x[1] += xOffset;
        container.node.children?.forEach((node) => {
          node.x! += xOffset;
          if (this.isEdit) {
            this.editNodes.add(node);
          }
          node.children?.forEach((childNode) => {
            container.setPositionX(childNode);
          });
        });
        DeepCopy(container.bbox, boundary);
      }
    } else {
      while (--index >= 0) {
        container = this.containers[index];
        xOffset = container.bbox.x[1] - boundary.x[0] + this.gap.horizontal * 3;
        if (xOffset === 0) break;
        container.setContainerPositionX(xOffset);
        DeepCopy(container.bbox, boundary);
      }
    }
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
    return renderNode;
  }

  registerInstance(cy: cytoscape.Core) {
    this.cyRender = new cyRender(cy);
  }

  registerShape(shape: type.renderType, calcFunc: shapeType.CalcFunc) {
    this.shape.customShape(shape, calcFunc);
  }

  beforeRender(callback: Function) {
    if (typeof callback !== 'function') {
      return EmitError('beforeRender must take a function as an argument ');
    }
    this.hook = callback;
  }

  setLine(line?: type.line) {
    if (line) {
      this.renderData.push(line);
    } else {
      this.renderData.push(...this.lines);
    }
  }
}

export default Graph;
