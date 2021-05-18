import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

// Get an user
export const useUser = (userId) => {
  return useQuery(['users', userId], () =>
    axios
      .get(`http://hungbqit-001-site5.itempurl.com/api/Users/${userId}`)
      .then((res) => res.data)
  );
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
};



// Disable an existing user
export const useDisableUser = () => {};

// Update an exsiting user
export const useUpdateUser = () => {};
