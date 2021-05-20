import React, { useEffect, useState, useRef } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { UsersTable } from './UsersTable';
import { useHistory } from 'react-router-dom';
import {format} from  'date-fns'
import { useCreateUser } from './UserHooks';
function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false)
  const usersRef = useRef(null);
  const history = useHistory();

  const DisableUsers = async (id) => {
    await useCreateUser.disable(id)
    .then((res) => {
      setUsers(res.data.data);
      if (res.status === 200) {
        alert('User Deleted');
      }
    })
    .catch(() => {
      alert('There are valid assigments belongs to this users. Please close all assignment before disable users');
    });
  };

  
  useEffect(() => {
    setLoading(true)
    useCreateUser.getall()
    .then(res => {
      usersRef.current = res.data.data
      setUsers(res.data.data)
      setLoading(false)
    })
    .catch(err => console.log(err))
  }, [])  
  
  const getUserId = (rowIndex) => {
    if (!usersRef.current) return
    const id = usersRef.current[rowIndex].id
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
        Cell: ({value}) => {return format(new Date(value), 'dd/MM/yyyy')}
      },
      {
        Header: 'JoinedDate',
        accessor: 'joinedDate',
        Cell: ({value}) => {return format(new Date(value), 'dd/MM/yyyy')}
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
        accessor: 'roles',
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
              <span className='font' onClick={() => getUserId(rowIdx)}>
                  <i className='bx bx-edit'></i>
              </span>
              &emsp;
              <span className='font' onClick={() => DisableUsers(rowIdx)}>
                <i className='fas fa-times '></i>
              </span>
            </div>
          );
        },
        
      },
    ],
    []
  )


  return (
    <LayoutAdmin>
       <UsersTable columns={columns} data={users} loading={loading}/>
    </LayoutAdmin>
  );
}

export default User;
