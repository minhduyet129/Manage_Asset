import React, { useEffect, useMemo, useRef, useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { UsersTable } from './UsersTable';
import {useUsers} from './UserHooks'
import { useHistory } from 'react-router-dom';

function User() {
  const Delete =  async  (id) => {};
  // option 1(Usequery to call api)
  const getUsers = useUsers();
  const usersRef = useRef();
  const history = useHistory();
  
  const data = React.useMemo(
    () => getUsers?.data?.data?.data || [],
    [getUsers?.data?.data?.data]
    );
    
  usersRef.current = data


  const getUserId = (rowIndex) => {
    if (!usersRef.current) return null;
    const id = usersRef.current[rowIndex].id;
    if (id) {
      history.push(`/admin/users/edit/${id}`)
    }
  };
  

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
        Header:'Role',
        accessor: 'roleType',
      },
      {
        Header: 'Username',
        accessor: 'userName',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: (props) => {
          const rowIdx = props.row.id;
          
          return (
            <div>
              <span onClick={() => getUserId(rowIdx)}>
                  <i className='far fa-edit action mr-2'></i>
              </span>
              &emsp;
              <span onClick={() => Delete()}>
                <i className='fas fa-times '></i>
              </span>
            </div>
          );
        },
        
      },
    ],
    []
  )


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
