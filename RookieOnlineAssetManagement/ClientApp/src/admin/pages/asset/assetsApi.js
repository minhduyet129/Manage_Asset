import { api } from '../api';


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY2hpbmhuMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNjIyMDEzMTc2LCJpc3MiOiJodHRwOi8vcm9va2llcy0wMDEtc2l0ZTEuaXRlbXB1cmwuY29tIiwiYXVkIjoiaHR0cDovL3Jvb2tpZXMtMDAxLXNpdGUxLml0ZW1wdXJsLmNvbSJ9.ELuJDSZd5r5t88vYmzcBGSpCmymzF22BANAVb7kobic"
function getAssets  () {
  return api.get('/Assets' , {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

function getAsset (id) {
 return api.get(`/Assets/${id}`)

}
  

// CREATE
function createAsset  (assets) {
  return api.post('/Assets', assets);
} 
// Get categories for creating new assets
function getCategories  () {
  return api.get('categories')

}
  

// UPDATE
function updateAsset (assets, id) {
  return api.put(`/Assets/${id}`, {
    assetName: assets.assetName,
    specification: assets.specification,
    installedDate: assets.installedDate,
    assetState: assets.state,
  })
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
