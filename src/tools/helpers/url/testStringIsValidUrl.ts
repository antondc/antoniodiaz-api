// https://gist.github.com/rodneyrehm/8013067

export const testStringIsValidUrl = (string: string): boolean => {
  const urlHasSpaces = string.includes(' ');
  if (urlHasSpaces) return false;

  try {
    new URL(string);

    return true;
  } catch {
    return false;
  }
};
