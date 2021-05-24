import { api } from '../api';
// GET
export const getAssets = () => api.get('/assets').then((res) => res.data.data);

export const getAsset = (id) =>
  api.get(`/assets/${id}`).then((res) => res.data.data);

// CREATE
export const createAsset = (values) => api.post('/assets', values);
// Get categories for creating new assets
export const getCategories = () =>
  api.get('/categories').then((res) => res.data);

// UPDATE
export const updateAsset = ({ id, ...updatedAsset }) =>
  api.put(`/assets/${id}`, updatedAsset).then((res) => res.data.data);

// DELETE
export const deleteAsset = (id) => api.delete(`/assets/${id}`);
