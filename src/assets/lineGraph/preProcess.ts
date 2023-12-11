import * as type from './type';
import Graph from './index';
import { Helper } from './help/helper';

export default class preProcess {
  data: type.node[];
  nodeSet: Set<type.nodeId>;
  repeatMap: Map<type.nodeId, Map<type.nodeId, number>>;
  nodeMap: Map<type.nodeId, type.node>;
  repeatNodes: Map<type.nodeId, type.nodeId>;
  graph: Graph;
  constructor(
    data: type.node[],
    nodeSet: Set<type.nodeId>,
    repeatMap: Map<type.nodeId, Map<type.nodeId, number>>,
    nodeMap: Map<type.nodeId, type.node>,
    repeatNodes: Map<type.nodeId, type.nodeId>,
    graph: Graph
  ) {
    this.data = data;
    this.nodeSet = nodeSet;
    this.repeatMap = repeatMap;
    this.nodeMap = nodeMap;
    this.repeatNodes = repeatNodes;
    this.graph = graph;
    this.preProcess(this.data);
    this.dealRepeat(this.data);
    this.setRepeatNodes();
  }
  preProcess(nodes: type.node[], fatherNode?: type.node) {
    nodes.forEach((node, index) => {
      if (this.nodeSet.has(node.id)) {
        const cloneNode = {} as type.node;
        Helper.DeepCopy(node, cloneNode, 'fatherNode');
        nodes[index] = cloneNode;
        node = nodes[index];
        if (this.isMatchClone(cloneNode) && !this.isMatchIgnore(cloneNode)) {
          const cloneNodeId = this.getCloneNodeId(cloneNode.id)!;
          if (this.graph.edges) {
            this.changeEdgeNodeId(node.id, fatherNode!.id, cloneNodeId);
          }
          node.id = cloneNodeId;
        }
      }
      if (fatherNode) {
        nodes[index].fatherNode = fatherNode;
      }
      if (this.nodeSet.has(node.id)) {
        if (!this.repeatMap.has(node.id)) {
          this.signRepeat(this.nodeMap.get(node.id)!);
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
      } else if (node.left || node.right) {
        node.children = [];
        if (node.left?.length) {
          node.left.forEach((childNode) => node.children!.push(childNode));
        }
        if (node.right?.length) {
          node.right.forEach((childNode) => node.children!.push(childNode));
        }
        this.preProcess(node.children, node);
      }
    });
  }

  dealTriangle(node: type.node) {
    const currentNode = node;
    const lastNode = this.nodeMap.get(node.id)!;
    if (currentNode.fatherNode === lastNode.fatherNode) return false;
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
      if (repeatMap.size === 1) {
        this.nodeMap.get(nodeId)!.show = true;
      } else {
        if (max === 0) {
          this.repeatNodes.delete(nodeId);
        } else {
          this.repeatNodes.set(nodeId, id!);
        }
      }
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
      if (node.triangle) {
        const repeatMap = this.repeatMap.get(node.id);
        repeatMap!.set(node.fatherNode!.id, Infinity);
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
    let lastNode: type.node | undefined = void 0;
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
        father.children[0].hide = true;
        lastNode = father.children[0];
      }
    }
    if (lastNode) {
      delete lastNode.hide;
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
    if (grandNode.type === 'event') return;
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

  getCloneNodeId(nodeId: type.nodeId) {
    if (!this.graph.repeatCloneConfig)
      return Helper.EmitError('repeatCloneConfig is not defined');
    if (!this.graph.cloneNodesMap!.has(nodeId)) {
      this.graph.cloneNodesMap?.set(nodeId, new Set());
    }
    const cloneSet = this.graph.cloneNodesMap!.get(nodeId)!;

    const size = cloneSet.size;
    const cloneNodeId =
      nodeId + 'clone' + (size + 1).toString().padStart(5, '0');
    cloneSet.add(cloneNodeId);
    return cloneNodeId;
  }

  isMatchClone(node: type.node) {
    if (!this.graph.repeatCloneConfig || !this.graph.repeatCloneConfig.match)
      return false;
    const configs = this.graph.repeatCloneConfig.match;
    for (const key in configs) {
      const configList = configs[key];
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        if (configList.indexOf(node[key as keyof type.node]) > -1) {
          return true;
        }
      }
    }
    return false;
  }

  isMatchIgnore(node: type.node) {
    if (!this.graph.repeatCloneConfig || !this.graph.repeatCloneConfig.ignore)
      return false;
    const configs = this.graph.repeatCloneConfig.ignore;
    for (const key in configs) {
      const configList = configs[key];
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        if (configList.indexOf(node[key as keyof type.node]) > -1) {
          return true;
        }
      }
    }
    return false;
  }

  changeEdgeNodeId(
    nodeId: type.nodeId,
    fatherNodeId: type.nodeId,
    cloneNodeId: type.nodeId
  ) {
    this.graph.edges.forEach((edge) => {
      if (edge.source_id === nodeId && edge.target_id === fatherNodeId) {
        edge.source_id = cloneNodeId;
      } else if (edge.target_id === nodeId && edge.source_id === fatherNodeId) {
        edge.target_id = cloneNodeId;
      }
    });
  }
}
