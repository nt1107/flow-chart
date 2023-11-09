import * as type from '../type';

export type returnSize = {
  width: number;
  height: number;
};

export type CalcFunc = (
  contentWidth: number,
  contentHeight: number
) => returnSize;

export type ShapeType = {
  [key in type.renderType]?: (
    contentWidth: number,
    contentHeight: number
  ) => returnSize;
} & {
  customShape: (shape: type.renderType, calcFunc: CalcFunc) => void;
};
