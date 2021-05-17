import React, { useEffect, useMemo, useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useQuery } from 'react-query';
import axios from 'axios';
import { COLUMNS } from './columns';
import { UsersTable } from './UsersTable';

function User() {
  // option 1(Usequery to call api)
  const getUsers = useQuery('users', () =>
    axios.get('http://hungbqit-001-site5.itempurl.com/api/Users')
  );
  const data = React.useMemo(
    () => getUsers?.data?.data?.data || [],
    [getUsers?.data?.data?.data]
  );

  console.log(data)

  // option 2(Useeffect to call api)
  // const [users, setUser] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     axios
  //       .get('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users')
  //       .then((res) => res.data)
  //       .then((data) => {
  //         setUser(data);
  //       });
  //   })();
  // }, []);

  // console.log(users)

  

  //  const data = React.useMemo(() => users, [users]);

   const columns = React.useMemo(() => COLUMNS, []);

  


  // if (getUsers.isLoading) {
  //   return 'Loading...';
  // }

  // if (getUsers.error) {
  //   return `Error: ${getUsers.error.message}, try again!`;
  // }

  return (
    <LayoutAdmin>
      <UsersTable columns={columns} data={data} />
    </LayoutAdmin>
  );
}

export default User;
