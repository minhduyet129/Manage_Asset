import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';



// Get an user
async function edit (id) {

  return axios
      .get(`http://hungbqit-001-site5.itempurl.com/api/Users/${id}`)
};

// Get users
export const useUsers = () => {
  return useQuery('users', () =>
    axios
      .get('http://hungbqit-001-site5.itempurl.com/api/Users')
  );
};

// Create a new user
function create(users)  {
  return axios.post(
    'http://hungbqit-001-site5.itempurl.com/api/Users',
    users
  )
};

export const useCreateUser = {
  create,
  edit,
};



// Disable an existing user
export const useDisableUser = () => {};

// Update an exsiting user
export const useUpdateUser = () => {};
