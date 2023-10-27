export const EmitError = (error: string) => {
  alert(error);
};

export const DeepCopy = (source: any, target: any) => {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = Array.isArray(source[key]) ? [] : {};
      DeepCopy(source[key], target[key]);
    } else {
      target[key] = source[key];
    }
  }
};
