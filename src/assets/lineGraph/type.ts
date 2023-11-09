import type Graph from './index';
import Shape from './Shape/shape';
export type nodeType = 'container' | 'entity' | 'description' | 'event';
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
  | 'vee';
export type typeMap = Record<nodeType, renderType>;
export type nodeId = string | number;
export interface line extends Record<string, any> {
  data: {
    source?: nodeId;
    target?: nodeId;
    parent?: nodeId;
  };
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
  left?: node[];
  right?: node[];
  style?: style;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  vheight?: number;
  vwidth?: [number, number];
  childrenVheight?: number;
  fatherNode?: node;
  hasRepeatNode?: Boolean;
  disallowChildrenRealignment?: Boolean;
  repeatNodeId?: nodeId;
  parent?: nodeId;
  hide?: Boolean;
  triangle?: Boolean;
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
