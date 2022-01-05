export const getNested = <T>(object: Record<string, any>, path: string, separator?: string): T => {
  try {
    separator = separator || '.';

    return path
      .replace('[', separator)
      .replace(']', '')
      .split(separator)
      .reduce((obj, property) => obj[property], object);
  } catch (err) {
    return undefined;
  }
};
