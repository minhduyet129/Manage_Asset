import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';



// Get an user
  function getbyid (id) {

  return  axios
      .get(`http://hungbqit-001-site5.itempurl.com/api/Users/${id}`)
};

// Get users
function getall() {
  
    return axios
      .get('http://hungbqit-001-site5.itempurl.com/api/Users')
};


// Create a new user
function create(users,)  {
  return axios.post(
    'http://hungbqit-001-site5.itempurl.com/api/Users',
    users
  )
};

//Edit an user

function edit(users,id) {
  return axios.put(
    `http://hungbqit-001-site5.itempurl.com/api/Users/${id}`, {
      id : users.id,
      // firstName: users.firstName,
      // lastName: users.lastName,
      doB: users.doB,
      joinedDate: users.joinedDate,
      gender: users.gender,
      // location: users.location,
      // userName: users.userName,
      roleType: users.roleType,
    }
  )
}

function disable(id) {
  return axios.put(
    `http://hungbqit-001-site5.itempurl.com/api/Users/disable/${id}` 
  )
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
