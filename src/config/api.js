const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  compliance: `${API_BASE_URL}/api`,
  ocrCompliance: `${API_BASE_URL}/api`,
  audit: `${API_BASE_URL}/api/audit`
};

export default API_BASE_URL;
