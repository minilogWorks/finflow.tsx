// utils/helpers.ts
export const generateId = (): string => {
  return "cat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
};
