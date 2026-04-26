/**
 * Parse date from various formats including Excel serial numbers
 */
export const parseRobustDate = (value) => {
  if (!value || String(value).trim() === "" || String(value).toUpperCase() === "NA") return null;
  
  // Handle Excel serial numbers (e.g. "45986")
  const num = Number(value);
  if (!isNaN(num) && num > 30000 && num < 60000) {
    // 30000 is mid-1981, 60000 is mid-2064. Good range for PO dates.
    return new Date((num - 25569) * 86400 * 1000);
  }
  
  // Standard Date parse
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d;
  
  return null;
};

/**
 * Format date to standard readable string
 */
export const formatDate = (date, format = 'DD-MMM-YYYY') => {
  const d = parseRobustDate(date);
  if (!d) return "N/A";
  
  if (format === 'YYYY-MM-DD') {
    return d.toISOString().split('T')[0];
  }
  
  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  
  if (format === 'DD-MMM-YYYY') {
    return `${day}-${month}-${year}`;
  }
  
  return d.toLocaleDateString();
};
