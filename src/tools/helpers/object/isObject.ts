export const isObject = (item: unknown): boolean => item && typeof item === 'object' && !Array.isArray(item);
