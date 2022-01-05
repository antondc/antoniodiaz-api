// Get extension of file name
// @param {fileName} String
// @returns String
const getExtension = (fileName: string): string => fileName?.split('.').pop();

export default getExtension;
