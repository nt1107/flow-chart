import * as type from '../type';
import { EmitError } from '../helper';
import { ShapeType } from '../Shape/type';
import Graph from '../index';
import Container from '../newContainer';

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
    const _shape = shapeMap[type];
    if (!_shape) {
      return EmitError(`type ${type} is not defined`);
    }
    const calcFunc = shape[_shape];
    if (!calcFunc) {
      return EmitError(
        `The calculation method for this shape ${_shape} is not defined`
      );
    }
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
