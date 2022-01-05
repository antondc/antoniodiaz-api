export const getFilenameFromUrl = (url: string): string => {
  if (!url || url === '') return '';

  const fileName = url.substring(url.lastIndexOf('/') + 1);

  return fileName;
};
