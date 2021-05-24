import React, { useEffect, useState, useRef } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import UsersTable from './UsersTable';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { useCreateUser } from './UserHooks';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState(false);
  const [totalPages, setTotalPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const usersRef = useRef(null);
  const history = useHistory();

  const DisableUsers = async (index) => {
    if (!usersRef.current) return;
    const id = usersRef.current[index].id;

    await useCreateUser
      .disable(id)
      .then((res) => {
        setChanges((prev) => {
          const current = !prev;
          return current;
        });
        if (res.status === 200) {
          alert('User Deleted');
        }
      })
      .catch(() => {
        alert(
          'There are valid assigments belongs to this users. Please close all assignment before disable users'
        );
      });
  };

  const getusers = () => {
    setLoading(true);
    useCreateUser
      .getall(pageNumber)
      .then((res) => {
        usersRef.current = res.data.data;
        setUsers(res.data.data);
        console.log(res.data);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getusers, [changes, pageNumber]);

  const getUserId = (rowIndex) => {
    if (!usersRef.current) return;
    const id = usersRef.current[rowIndex].id;
    if (id) {
      history.push(`/admin/users/edit/${id}`);
    }
  };

  const renderPaginationBtn = () => {
    let obj = [];
    for (let i = 1; i <= totalPages; i++) {
      obj.push(
        <div onClick={() => setPageNumber(i)} key={i}>
          {i}
        </div>
      );
    }
    return obj;
  };

  // const data = React.useMemo(() => users, [users]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'StaffCode',
        accessor: 'staffCode',
      },
      {
        Header: 'FullName',
        accessor: (d) => <div>{d.firstName + ' ' + d.lastName}</div>,
      },
      {
        Header: 'Username',
        accessor: 'userName',
      },
      {
        Header: 'JoinedDate',
        accessor: 'joinedDate',
        Cell: ({ value }) => {
          return format(new Date(value), 'dd/MM/yyyy');
        },
      },
      {
        Header: 'Type',
        accessor: 'roles',
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
  );

  return (
    <LayoutAdmin>
      <UsersTable columns={columns} data={users} loading={loading} />
      <div className='paging-box'>
        <div className='paging-btn'>{totalPages && renderPaginationBtn()}</div>
      </div>
    </LayoutAdmin>
  );
};

export default User;
