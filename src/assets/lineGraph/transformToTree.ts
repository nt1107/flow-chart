import * as type from './type';

const treeNodeMap = new Map() as Map<type.nodeId, type.node>;
const treeData = [] as type.node[];
let nodes: type.splitNode[];
const transformToTree = (data: type.splitData): type.node[] => {
  nodes = data.nodes;
  const edges = data.edges;

  nodes.forEach((node) => {
    if (node.type === 'container') {
      treeData.push(getTreeNode(node.id));
    }
  });

  edges.forEach((edge) => {
    const sourceNode = getTreeNode(edge.source_id);
    const targetNode = getTreeNode(edge.target_id);

    if (sourceNode.isEvent || targetNode.isEvent) {
      if (!setEvent(sourceNode, targetNode)) {
        addChildren(sourceNode, targetNode, edge.label);
      }
    } else {
      addChildren(sourceNode, targetNode, edge.label);
    }
  });
  return treeData;
};

const addChildren = (
  sourceNode: type.node,
  targetNode: type.node,
  label?: string
) => {
  if (
    targetNode.isEvent &&
    !sourceNode.isEvent &&
    sourceNode.type !== 'container'
  ) {
    addChildren(targetNode, sourceNode, label);
    return;
  }
  if (!sourceNode!.children) {
    sourceNode!.children = [];
  }
  if (sourceNode.children.indexOf(targetNode) > -1) return;
  targetNode.lineLabel = label || '';
  sourceNode!.children.push(targetNode);
};

const setEvent = (
  source: type.node,
  target: type.node,
  container?: type.node
) => {
  if (source.isEvent && !target.isEvent) {
    addChildren(getTreeNode(source.parent!), source);
    return false;
  }
  if (!source.isEvent && target.isEvent) {
    addChildren(getTreeNode(target.parent!), target);
    return false;
  }

  if (!container) {
    const container1 = getTreeNode(target.parent!);
    const container2 = getTreeNode(source.parent!);
    if (container1 !== container2) {
      return false;
    } else {
      container = container1;
    }
  }
  if (!container.children) {
    container.children = [];
    container.children.push(source);
    container.children.push(target);
    source.next = target;
  } else {
    const startIndex = container.children.findIndex(
      (node) => node.id === source.id
    );
    const endIndex = container.children.findIndex(
      (node) => node.id === target.id
    );
    if (startIndex > -1 && endIndex === -1) {
      container.children.splice(startIndex + 1, 0, target);
    } else if (startIndex === -1 && endIndex > -1) {
      container.children.splice(endIndex, 0, source);
    } else if (startIndex === -1 && endIndex === -1) {
      container.children.push(source);
      container.children.push(target);
    } else if (startIndex > -1 && endIndex > -1) {
      if (startIndex + 1 === endIndex) return true;
      if (startIndex > endIndex) {
        let endItem: type.node | undefined = target;
        while (endItem) {
          moveArrayElement(container.children, endIndex, startIndex);
          endItem = endItem.next;
        }
      }
    }
    source.next = target;
  }
  return true;
};

const moveArrayElement = (
  arr: type.node[],
  fromIndex: number,
  toIndex: number
) => {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= arr.length ||
    toIndex >= arr.length
  ) {
    return arr; // 如果索引无效，则返回原始数组
  }

  const element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);

  return arr;
};

const getTreeNode = (id: type.nodeId): type.node => {
  if (treeNodeMap.has(id)) return treeNodeMap.get(id)!;
  const container = nodes.find((node) => node.id === id)!;
  const treeNode = {} as type.node;
  setNodeProperty(container, treeNode);
  treeNodeMap.set(id, treeNode);
  return treeNode;
};

const setNodeProperty = (node: type.splitNode, treeNode: type.node) => {
  treeNode.id = node.id;
  treeNode.label = node.label;
  treeNode.parent = node.parent;
  setNodeType(node, treeNode);
};

const setNodeType = (node: type.splitNode, treeNode: type.node) => {
  if (node.type === 'container') {
    treeNode.type = 'container';
  } else {
    treeNode.type = node.type;
  }

  if (node.layout_type === 'event') {
    treeNode.isEvent = true;
  }
};
export default transformToTree;
