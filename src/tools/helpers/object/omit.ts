// https://levelup.gitconnected.com/omit-is-being-removed-in-lodash-5-c1db1de61eaf

import unset from 'lodash/unset';

export const omit = (
  originalObject: Record<string, unknown> = {},
  keysToOmit: string[] = []
): Record<string, unknown> => {
  const clonedObject = { ...originalObject };

  keysToOmit.forEach((item) => unset(clonedObject, item));

  return clonedObject;
};
