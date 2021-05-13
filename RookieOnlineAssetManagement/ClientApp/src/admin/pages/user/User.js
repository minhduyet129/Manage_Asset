import React, { useMemo } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useQuery } from 'react-query';
import axios from 'axios';
import { COLUMNS } from './columns';
import { useTable } from 'react-table';

function User() {
  const getUsers = useQuery('users', () =>
    axios.get('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users')
  );

  const columns = useMemo(() => COLUMNS, []);
  const data2 = useMemo(() => getUsers.data, []);

  const tableInstance = useTable({
    columns,
    data: data2,
  });

  if (getUsers.isLoading) {
    return 'Loading...';
  }

  if (getUsers.error) {
    return `Error: ${getUsers.error.message}, try again!`;
  }

  console.log(getUsers.dataata);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <LayoutAdmin>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
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
    </LayoutAdmin>
  );
}

export default User;
