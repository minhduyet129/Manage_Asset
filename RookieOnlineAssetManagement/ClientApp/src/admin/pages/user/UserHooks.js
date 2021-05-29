import { api } from '../api';

// Get an user
function getbyid(id) {
  return api.get(`/Users/${id}`);
}

// Get users
function getall(pageNumber) {
  return api.get(`/Users?PageNumber=${pageNumber}`);
}

// Create a new user
function create(users) {
  return api.post('/Users', users);
}

//Edit an user

function edit(users, id) {
  return api.put(`/Users/${id}`, {
    doB: users.doB,
    joinedDate: users.joinedDate,
    gender: users.gender,
    roleType: users.roleType,
  });
}

function disable(id) {
  return api.put(`/Users/disable/${id}`);
}

export const useCreateUser = {
  create,
  getbyid,
  edit,
  disable,
  getall,
};
