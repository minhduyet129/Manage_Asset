import React from 'react'
import { useTable, usePagination } from 'react-table';
import { Link } from 'react-router-dom';
export const UsersTable = ({columns, data}) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        prepareRow,
      } = useTable({ columns, data }, usePagination);
    return (
        
        <div>
            <Link to= '/addusers'>
            <button>Create new</button>
            </Link>
            <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups &&
            headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    style={{
                      borderBottom: 'solid 3px red',
                      background: 'aliceblue',
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page &&
            page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          padding: '10px',
                          border: 'solid 1px gray',
                          background: 'papayawhip',
                        }}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
      <div>
        <button onClick={() => previousPage()}>Previous</button>
        <button onClick={() => nextPage()}>Next</button>
      </div>
        </div>
        
    )
}
