import { useMemo } from 'react';
import { useTable } from 'react-table';
import axios from 'axios'

const UserHomeTable = () => {
  // const assignmentInfo = useQuery('assignments', async () => {
  //   const response = await axios.get('api/assignments');
  //   if (response.isError) {
  //     throw new Error('Network response was error.');
  //   }
  //   const result = await response.data;
  //   return result;
  // });

  const columns = useMemo(
    () => [
      {
        Header: 'Asset Code',
        accessor: 'assetCode',
      },
      {
        Header: 'Asset Name',
        accessor: 'assetName',
      },
      {
        Header: 'Assigned By',
        accessor: 'assignBy',
      },
      {
        Header: 'Assigned Date',
        accessor: 'assignDate',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: (props) => {
          const rowIdx = props.row.id;

          return (
            <div id='actions' style={{ display: 'flex' }}>
              <span className='font'>
                <i className='bx bx-check'></i>
              </span>
              &emsp;
              <span className='font'>
                <i className='fas fa-times '></i>
              </span>
              &emsp;
              <span className='font undo-icon'>
                <i className='fas fa-undo'></i>
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: columns, data: assignmentInfo.data });

  return (
    <div>
      <h2>User Home</h2>
      <div>
        <table id='table' {...getTableProps()}>
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
          {assignmentInfo.isLoading ? (
            <div className='spinner'>
              <i className='fas fa-spinner fa-spin'></i>
            </div>
          ) : (
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
          )}
        </table>
      </div>
    </div>
  );
};

export default UserHomeTable;
