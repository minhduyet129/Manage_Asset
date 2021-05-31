
import axios from 'axios';
function getReports() {
  return axios.get('api/Reports');
}

export const getApiReport = {
  getReports,
};
