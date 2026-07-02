export const formatStatus = (status) => {
  if (!status) return '';
  return status
    .split(/[-_ ]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ');
};
