import LayoutAdmin from '../layout/LayoutAdmin';
import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import { Link } from 'react-router-dom';
import '../TableView.css';

function User() {
  const data = useMemo(
    () => [
      {
        col1: 'SD1901',
        col2: 'Nguyen Van Tai',
        col3: 'nguyenvantai',
        col4: '26-10-2020',
        col5: 'Staff',
      },
      {
        col1: 'SD1902',
        col2: 'Dong Chi',
        col3: 'dongchi',
        col4: '26-03-2021',
        col5: 'Staff',
      },
      {
        col1: 'SD1903',
        col2: 'Nguyen Van Vo',
        col3: 'nguyenvanvo',
        col4: '16-09-2020',
        col5: 'Staff',
      },
      {
        col1: 'SD1904',
        col2: 'Tran Nam',
        col3: 'trannam',
        col4: '23-05-2020',
        col5: 'Staff',
      },
      {
        col1: 'SD1905',
        col2: 'Vu Thi Thanh',
        col3: 'vuthithanh',
        col4: '26-11-2020',
        col5: 'Staff',
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Staff Code',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Full Name',
        accessor: 'col2',
      },
      {
        Header: 'Username',
        accessor: 'col3',
      },
      {
        Header: 'Joined Date',
        accessor: 'col4',
      },
      {
        Header: 'Type',
        accessor: 'col5',
      },
      {
        Header: 'Action',
        accessor: 'col6',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <h2>Manage User</h2>
        <div className='table__view--search'>
          <form className='search'>
            <label />
            <input type='text' placeholder='State' />
            <i className='bx bx-filter-alt' />
          </form>
          <form className='search'>
            <label />
            <input type='text' placeholder='Name' />
            <i className='bx bx-search' />
          </form>
          <Link to='/admin/users/create'>
            <button className='btn'>Create New User</button>
          </Link>
        </div>
        <div>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutAdmin>
  );
}

export default User;
