import LayoutAdmin from '../layout/LayoutAdmin';
import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import '../TableView.css';

function Asset() {
  const data = useMemo(
    () => [
      {
        col1: 'LA10001',
        col2: 'Laptop Dell',
        col3: 'Laptop',
        col4: 'Available',
        col5: 'sdfsd',
      },
      {
        col1: 'LA10002',
        col2: 'Laptop Acer',
        col3: 'Laptop',
        col4: 'Available',
        col5: '',
      },
      {
        col1: 'LA10003',
        col2: 'Laptop Macbook',
        col3: 'Laptop',
        col4: 'Available',
        col5: '',
      },
      {
        col1: 'LA10004',
        col2: 'Laptop Thinkpad',
        col3: 'Laptop',
        col4: 'Available',
        col5: '',
      },
      {
        col1: 'LA10005',
        col2: 'Laptop Macbook Air',
        col3: 'Laptop',
        col4: 'Available',
        col5: '',
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Asset Code',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Asset Name',
        accessor: 'col2',
      },
      {
        Header: 'Category',
        accessor: 'col3',
      },
      {
        Header: 'State',
        accessor: 'col4',
      },
      {
        Header: 'Action',
        accessor: 'col5',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <h2>Manage Asset</h2>
        <div className='table__view--search'>
          <form className='search'>
            <label />
            <input type='text' placeholder='State' />
            <i className='bx bx-filter-alt' />
          </form>
          <form className='search'>
            <label />
            <input type='text' placeholder='Category' />
            <i className='bx bx-filter-alt' />
          </form>
          <form className='search'>
            <label />
            <input type='text' placeholder='Name' />
            <i className='bx bx-search' />
          </form>
          <form className='search'>
            <label />
            <input type='text' placeholder='Asset Code' />
            <i className='bx bx-search' />
          </form>
          <button href='assets' className='btn'>
            Create New Asset
          </button>
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

export default Asset;
