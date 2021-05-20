import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://hungbqit-001-site5.itempurl.com/api/Users/',
});

// Get an user
export const useUser = (userId) => {
  return useQuery(['users', userId], () =>
    api.get(`/${userId}`).then((res) => res.data)
  );
};

// Get users
export const useUsers = () => {
  return useQuery('users', () => api.get('/').then((res) => res.data));
};

// Create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios.post('http://hungbqit-001-site5.itempurl.com/api/Users', values),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries('users');
      },
    }
  );
};

// Disable an existing user
export const useDisableUser = () => {};

// Update an exsiting user
export const useUpdateUser = () => {};
