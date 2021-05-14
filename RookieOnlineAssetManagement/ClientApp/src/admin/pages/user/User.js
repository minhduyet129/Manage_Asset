import React, { useEffect, useMemo, useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useQuery } from 'react-query';
import axios from 'axios';
import { COLUMNS } from './columns';
import { UsersTable } from './UsersTable';

function User() {
  //option 1(Usequery to call api)
  // const getUsers = useQuery('users', () =>
  //   axios.get('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users')
  // );
  // const data = React.useMemo(
  //   () => getUsers?.data?.data || [],
  //   [getUsers?.data?.data]
  // );

  // option 2(Useeffect to call api)
  const [users, setUser] = useState([]);

  useEffect(() => {
    (async () => {
      axios
        .get('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users')
        .then((res) => res.data)
        .then((data) => {
          setUser(data);
        });
    })();
  }, []);

  const data = React.useMemo(() => users, [users]);

  const columns = React.useMemo(() => COLUMNS, []);

  // const getUsers = useQuery('users', () =>
  //   axios.get('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users')
  // );
  // console.log(getUsers);

  // const columns = useMemo(()  => COLUMNS, []);
  // const data = useMemo(() => getUsers?.data?.data || [], [getUsers?.data?.data]);

  // const tableInstance = useTable({
  //   columns,
  //   data
  // });

  // if (getUsers.isLoading) {
  //   return 'Loading...';
  // }

  // if (getUsers.error) {
  //   return `Error: ${getUsers.error.message}, try again!`;
  // }
  // const [users, setUser] = useState([]);

  // useEffect(() => {
  //   axios.get('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users').then(res=> {
  //     setUser(res.data)
  //   console.log(res);
  //   })
  // }, []);

  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //   tableInstance;

  return (
    <LayoutAdmin>
      <UsersTable columns={columns} data={data} />
    </LayoutAdmin>
  );
}

export default User;
