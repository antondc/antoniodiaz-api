export const toAbsolute = (url: string): string => {
  return url && url[0] !== '/' ? '/' + url : url;
};
