const severityOrder = {
  High: 0,
  Medium: 1,
  Low: 2
};

export const formatStatus = (status) => {
  if (!status) return '';
  return status
    .split(/[-_ ]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ');
};

export const getSeverityValue = (severity) => {
  if (!severity) return 'Low';
  const normalized = String(severity).trim();
  if (normalized === 'High' || normalized === 'Medium' || normalized === 'Low') {
    return normalized;
  }
  return 'Low';
};

export const getResolutionTimeText = (complaint) => {
  const severity = getSeverityValue(complaint?.severity);
  if (complaint?.status === 'submitted' || complaint?.status === 'accepted') {
    return 'Will be available once the department accepts your complaint.';
  }

  if (complaint?.status === 'in-progress' || complaint?.status === 'resolved') {
    if (severity === 'High') return '24 Hours';
    if (severity === 'Medium') return '3 Days';
    return '7 Days';
  }

  return '';
};

export const sortComplaintsBySeverity = (complaints = []) => {
  return [...complaints].sort((a, b) => severityOrder[getSeverityValue(a?.severity)] - severityOrder[getSeverityValue(b?.severity)]);
};
