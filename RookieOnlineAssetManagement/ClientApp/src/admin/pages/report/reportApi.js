import { api } from '../api';

function getReports() {
  return api.get('/Reports');
}

export const getApiReport = {
  getReports,
};
