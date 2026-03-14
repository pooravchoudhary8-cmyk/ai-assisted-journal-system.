import axios from 'axios';

const API = axios.create({
  baseURL: '/api/journal',
});

export const fetchEntries = (userId) => API.get(`/${userId}`);
export const createEntry = (entryData) => API.post('/', entryData);
export const analyzeText = (text) => API.post('/analyze', { text });
export const fetchInsights = (userId) => API.get(`/insights/${userId}`);
