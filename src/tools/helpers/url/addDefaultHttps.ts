export const addDefaultHttps = (url: string): string => {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) return 'https://' + url;

  return url;
};
