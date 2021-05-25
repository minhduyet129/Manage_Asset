import axios from 'axios';

// Get an user
function getbyid(id) {
  return axios.get(`http://hungbqit-001-site5.itempurl.com/api/Users/${id}`);
}

// Get users
function getall(pageNumber) {
  return axios.get(
    `http://hungbqit-001-site5.itempurl.com/api/Users?PageNumber=${pageNumber}`
  );
}

// Create a new user
function create(users) {
  return axios.post('http://hungbqit-001-site5.itempurl.com/api/Users', users);
}

//Edit an user

function edit(users, id) {
  return axios.put(`http://hungbqit-001-site5.itempurl.com/api/Users/${id}`, {
    doB: users.doB,
    joinedDate: users.joinedDate,
    gender: users.gender,
    roleType: users.roleType,
  });
}

function disable(id) {
  return axios.put(
    `http://hungbqit-001-site5.itempurl.com/api/Users/disable/${id}`
  );
}

export const useCreateUser = {
  create,
  getbyid,
  edit,
  disable,
  getall,
};

// Disable an existing user
export const useDisableUser = () => {};

// Update an exsiting user
export const useUpdateUser = () => {};
