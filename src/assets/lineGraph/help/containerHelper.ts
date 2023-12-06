import * as type from '../type';
import { ShapeType } from '../Shape/type';
import Graph from '../index';
import Container from '../container';

export const pure = {
  splitString(label: string, stringLen: number) {
    const str = [];
    for (let i = 0; i < label.length; i++) {
      str.push(label.slice(i, i + stringLen + 1));
      i += stringLen;
    }
    return str;
  },

  getCalcFunc(shape: ShapeType, shapeMap: type.typeMap, type: type.nodeType) {
    const _shape = shapeMap[type] || 'default';
    const calcFunc = shape[_shape];

    return calcFunc;
  }
};

export const Helper = {
  runWidthModeChange(
    graph: Graph,
    container: Container,
    mode: 'adjustY' | 'render' | 'adjustX',
    func: Function,
    param: any[]
  ) {
    const cache = graph.mode;
    graph.mode = mode;
    func.apply(container, param);
    graph.mode = cache;
  }
};
