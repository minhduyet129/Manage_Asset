import React, { useEffect, useMemo, useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { UsersTable } from './UsersTable';
import {useUsers} from './UserHooks'
import { Link } from 'react-router-dom';

function User() {
  const Delete =  async  (id) => {};
  // option 1(Usequery to call api)
  const getUsers = useUsers();
  
  const data = React.useMemo(
    () => getUsers?.data?.data?.data || [],
    [getUsers?.data?.data?.data]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id',
      },
      {
        Header: 'StaffCode',
        accessor: 'staffCode',
      },
      {
        Header: 'FirstName',
        accessor: 'firstName',
      },
      {
        Header: 'LastName',
        accessor: 'lastName',
      },
      {
        Header: 'Date of Birth',
        accessor: 'doB',
      },
      {
        Header: 'JoinedDate',
        accessor: 'joinedDate',
      },
      {
        Header: 'Gender',
        accessor: 'gender',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Username',
        accessor: 'userName',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: (data) => {
          console.log(data)
          return (
            <div>
              <span>
                <Link to={`/admin/users/edit/${data.data.id}`}>
                  <i className='far fa-edit action mr-2'></i>
                </Link>
              </span>
              &emsp;
              <span onClick={() => Delete()}>
                <i className='fas fa-trash action'></i>
              </span>
            </div>
          );
        },
        
      },
    ],
    []
  )

   console.log(data)


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
