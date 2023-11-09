import * as type from '../type';
import * as shapeType from './type';

export default class Shape implements shapeType.ShapeType {
  rectangle(contentWidth: number, contentHeight: number) {
    return {
      width: contentWidth + 20,
      height: contentHeight + 10
    };
  }

  ellipse(contentWidth: number, contentHeight: number): shapeType.returnSize {
    return {
      width: contentWidth + 30,
      height: contentHeight + 20
    };
  }

  round(contentWidth: number, contentHeight: number): shapeType.returnSize {
    const diameter = Math.max(contentWidth, contentHeight);
    return {
      width: diameter,
      height: diameter
    };
  }

  customShape(
    this: shapeType.ShapeType,
    shape: type.renderType,
    calcFunc: shapeType.CalcFunc
  ): void {
    this[shape] = calcFunc;
  }
}
