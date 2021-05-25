import LayoutAdmin from '../layout/LayoutAdmin';
import React, { useMemo, useRef } from 'react';
import { useTable } from 'react-table';
import { Link, useHistory } from 'react-router-dom';
import { getAssets } from './assetsApi';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { deleteAsset } from './assetsApi';
import { api } from '../api';
import '../TableView.css';

function Asset(props) {
  const assetsInfo = useQuery('assets', getAssets, { retry: 1 });
  // const { mutate, isLoading } = useMutation(deleteAsset);

  const removeAsset = (id) => {
    // mutate(id);
    // queryClient.invalidateQueries('assets');

    // write logic for delete asset here
    alert('remove asset');
  };

  const data = useMemo(() => assetsInfo.data || [], [assetsInfo.data]);

  const columns = useMemo(
    () => [
      {
        Header: 'Asset Code',
        accessor: 'assetCode', // accessor is the "key" in the data
      },
      {
        Header: 'Asset Name',
        accessor: 'assetName',
      },
      {
        Header: 'Category',
        accessor: 'name',
      },
      {
        Header: 'State',
        accessor: 'state',
      },
      {
        Header: '',
        accessor: 'actions',
        Cell: (props) => {
          // const rowIdx = props.row.id;
          return (
            <div>
              <Link to={`/admin/assets/edit`}>
                <span>
                  <i className='bx bx-edit' style={{ fontSize: '21px' }}></i>
                </span>
              </Link>
              &emsp;
              <span onClick={removeAsset}>
                <i className='bx bx-x' style={{ fontSize: '24px' }}></i>
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  console.log(assetsInfo);

  return assetsInfo.isLoading ? (
    <LayoutAdmin>
      <div className='table__view'>
        <h3>Loading...</h3>
      </div>
    </LayoutAdmin>
  ) : (
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
          <Link to='/admin/assets/create'>
            <button href='assets' className='btn'>
              Create New Asset
            </button>
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

export default Asset;
