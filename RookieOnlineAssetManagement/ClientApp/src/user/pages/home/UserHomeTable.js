import { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';

const UserHomeTable = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const callAssignmentsAPI = async () => {
    axios
      .get('api/Assignments')
      .then((res) => {
        setAssignments(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    callAssignmentsAPI();
  }, []);

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
    useTable({ columns: columns, data: assignments });

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
          {loading ? (
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

      {/* <div>
        {assignmentInfo.isLoading ? (
          <div className='spinner'>
            <i className='fas fa-spinner fa-spin'></i>
          </div>
        ) : assignmentInfo.isError ? (
          <div>{assignmentInfo.error.message}</div>
        ) : (
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
        )}
      </div> */}
    </div>
  );
};

export default UserHomeTable;
