import { api } from '../api';
import axios from 'axios'
function getAssets  () {
  return api.get('/Assets')
} 

function getAsset (id) {
 return api.get(`/Assets${id}`)

}
  

// CREATE
function createAsset  (assets) {
  return axios.post('/Assets', assets);
} 
// Get categories for creating new assets
function getCategories  () {
  return api.get('categories')

}
  

// UPDATE
function updateAsset ( id, updatedAsset ) {
  return api.put(`/Assets/${id}`, updatedAsset)
}

// DELETE
function deleteAsset  (id) {
  return api.delete(`/Assets/${id}`);

}

export const getApiAssets = {
  getAssets,
  getAsset,
  createAsset,
  getCategories,
  updateAsset,
  deleteAsset
};
