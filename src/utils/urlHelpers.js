export const getCleanUrl = (url) => {
  return url.replace(/-\d{2,4}x\d{2,4}(?=\.\w{3,4}$)/, '');
};
export const ensureAbsoluteUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
};