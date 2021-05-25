import { api } from '../api';
// GET
function getAssets  () {
  return api.get('/assets')
} 

function getAsset (id) {
 return api.get(`/assets/${id}`)

}
  

// CREATE
function createAsset  (assets) {
  return api.post('/assets', assets);
} 
// Get categories for creating new assets
function getCategories  () {
  return api.get('/categories')

}
  

// UPDATE
function updateAsset ( id, updatedAsset ) {
  return api.put(`/assets/${id}`, updatedAsset)
}

// DELETE
function deleteAsset  (id) {
  return api.delete(`/assets/${id}`);

}

export const getApiAssets = {
  getAssets,
  getAsset,
  createAsset,
  getCategories,
  updateAsset,
  deleteAsset
};
