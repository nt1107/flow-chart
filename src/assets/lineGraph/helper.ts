export const EmitError = (error: string) => {
  alert(error);
};

export const DeepCopy = (source: any, target: any, ignore?: string) => {
  for (const key in source) {
    if (ignore && key === ignore) {
      target[key] = source[key];
    } else if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = Array.isArray(source[key]) ? [] : {};
      DeepCopy(source[key], target[key]);
    } else {
      target[key] = source[key];
    }
  }
};
