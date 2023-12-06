import type Graph from './index';
import Shape from './Shape/shape';
export type layout = {
  rows: number;
  colomn: number;
};
export type GraphBbox = {
  x: [number, number][];
  y: [number, number][];
};
import type Container from './container';
export type nodeType = string;
export type renderType =
  | 'rectangle'
  | 'ellipse'
  | 'round'
  | 'triangle'
  | 'round-triangle'
  | 'round-rectangle'
  | 'bottom-round-rectangle'
  | 'cut-rectangle'
  | 'barrel'
  | 'rhomboid'
  | 'right-rhomboid'
  | 'diamond'
  | 'round-diamond'
  | 'pentagon'
  | 'round-pentagon'
  | 'hexagon'
  | 'round-hexagon'
  | 'concave-hexagon'
  | 'heptagon'
  | 'round-heptagon'
  | 'octagon'
  | 'round-octagon'
  | 'star'
  | 'tag'
  | 'round-tag'
  | 'vee'
  | 'default';
export type typeMap = Record<nodeType, renderType>;
export type nodeId = string | number;
export type edge = {
  source?: nodeId;
  target?: nodeId;
  parent?: nodeId;
};
export interface line extends Record<string, any> {
  data: edge;
}
export type baseOptions = {
  stringLen: number;
  fontSize: number;
  gap: {
    vertical: number;
    horizontal: number;
  };
  shapeMap: typeMap;
  repeatNodes: Map<nodeId, nodeId>;
  repeatMap: Map<nodeId, Map<nodeId, number>>;
  shape: Shape;
  graph: Graph;
};

export type node = {
  id: nodeId;
  label: string;
  type: nodeType;
  lineLabel?: string;
  direction?: direction;
  children?: node[];
  isEvent?: Boolean;
  isRoot?: Boolean;
  left?: node[];
  right?: node[];
  style?: style;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  vheight?: number;
  childrenVheight?: number;
  fatherNode?: node;
  hasRepeatNode?: Boolean;
  disallowChildrenRealignment?: Boolean;
  repeatNodeId?: nodeId;
  parent?: nodeId;
  hide?: Boolean;
  triangle?: Boolean;
  show?: Boolean;
  container?: Container;
  next?: node;
};
export type direction = 'left' | 'right' | 'bottom';

export type Hook = (nodeList: renderNode[]) => renderNode[];

export interface style extends Record<string, number | string | undefined> {
  width?: number;
  height?: number;
  label?: string;
  'font-size'?: number;
}

export interface renderNode extends Record<string, any> {
  data: {
    id?: nodeId;
    parent?: nodeId;
    type?: nodeType;
    source?: nodeId;
    target?: nodeId;
  };
  position?: {
    x: number;
    y: number;
  };
  style?: style;
}

export type bbox = {
  x: [number, number];
  y: [number, number];
};

export type gap = {
  vertical: number;
  horizontal: number;
};

export type splitEdge = {
  source_id: nodeId;
  target_id: nodeId;
  label: string;
};

export type splitNode = {
  id: nodeId;
  label: string;
  type: nodeType;
  parent?: nodeId;
  layout_type?: 'event' | '';
  attributes: Object;
};
export type splitData = {
  edges: splitEdge[];
  nodes: splitNode[];
};

export type repeatCloneConfig = {
  ignore?: Record<string, any[]>;
  match?: Record<string, any[]>;
};
